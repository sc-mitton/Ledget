package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-secretsmanager-caching-go/secretcache"

	sdk "github.com/ory/oathkeeper-client-go"
)

func getCachedJwks() (map[string]interface{}, error) {
	secretName := "oathkeeper_jwks"

	var (
		secretCache, _ = secretcache.New()
	)
	result, err := secretCache.GetSecretString(secretName)
	if err != nil {
		return nil, err
	}

	var jwks map[string]interface{}
	if err := json.Unmarshal([]byte(result), &jwks); err != nil {
		return nil, err
	}

	return jwks, nil
}

func getStoredJwks() (map[string]interface{}, error) {
	secretName := "oathkeeper_jwks"
	secretRegion := os.Getenv("AWS_REGION")
	if os.Getenv("ENVIRONMENT") == "test" {
		secretName = "oathkeeper_jwks_test"
	}
	if secretRegion == "" {
		secretRegion = "us-west-2"
	}

	config, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(secretRegion))
	if err != nil {
		log.Fatal(err)
	}
	svc := secretsmanager.NewFromConfig(config)
	input := &secretsmanager.GetSecretValueInput{
		SecretId:     aws.String(secretName),
		VersionStage: aws.String("AWSCURRENT"),
	}

	result, err := svc.GetSecretValue(context.TODO(), input)
	if err != nil {
		log.Fatal(err.Error())
	}

	var secretString string = *result.SecretString
	var jwks map[string]interface{}
	if err := json.Unmarshal([]byte(secretString), &jwks); err != nil {
		return nil, err
	}

	return jwks, nil
}

func getJwksData() ([]byte, error) {
	cachedJwks, err := getCachedJwks()
	if err != nil || cachedJwks == nil {
		fmt.Println("Failed to get cached JWKS. Getting from Secrets Manager...")
		storedJwks, err := getStoredJwks()
		if err != nil {
			return nil, err
		}
		return json.Marshal(storedJwks)
	}

	jwksData, err := json.Marshal(cachedJwks)
	if err != nil {
		return nil, err
	}

	return jwksData, nil
}

func setJwks() {
	// Get JWKS from AWS Secrets Manager
	jwksData, err := getJwksData()
	if err != nil {
		fmt.Printf("Failed to get JWKS data: %v\n", err)
		return
	}

	// Write JWKS to file
	jwksFilePath := "tmp/jwks.json"
	os.MkdirAll(filepath.Dir(jwksFilePath), 0755)
	jwksFile, err := os.Create(jwksFilePath)
	if err != nil {
		fmt.Printf("Failed to create JWKS file: %v\n", err)
		return
	}
	jwksFile.Write(jwksData)
	jwksFile.Close()
}

func getDecisionsRequest(event events.APIGatewayProxyRequest) sdk.ApiApiDecisionsRequest {
	configuration := sdk.NewConfiguration()

	// Set the headers needed by oathkeeper
	configuration.AddDefaultHeader("X-Forwarded-Method", event.HTTPMethod)
	configuration.AddDefaultHeader("X-Forwarded-Uri", event.Path)
	configuration.AddDefaultHeader("X-Forwarded-Host", event.Headers["Host"])
	configuration.AddDefaultHeader("X-Forwarded-Proto", "http")
	configuration.AddDefaultHeader("X-Forwarded-For", event.RequestContext.Identity.SourceIP)
	configuration.AddDefaultHeader("Authorization", event.Headers["Authorization"])

	configuration.Scheme = "http"
	configuration.Host = "0.0.0.0:4456"

	apiClient := sdk.NewAPIClient(configuration)
	request := apiClient.ApiApi.Decisions(context.Background())

	return request
}

func generatePolicy(principalID string, effect string, resource string) events.APIGatewayCustomAuthorizerResponse {
	authResponse := events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: principalID,
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   effect,
					Resource: []string{resource},
				},
			},
		},
	}

	return authResponse
}

func generateAllow(principalID string, resource string, oathkeeperResponse *http.Response) events.APIGatewayCustomAuthorizerResponse {
	policy := generatePolicy(principalID, "Allow", resource)
	policy.Context = map[string]interface{}{
		"authorizer": oathkeeperResponse.Header.Get("Authorization"),
		"x-user":     oathkeeperResponse.Header.Get("X-User"),
	}
	return policy
}

func generateDeny(principalID string, resource string) events.APIGatewayCustomAuthorizerResponse {
	return generatePolicy(principalID, "Deny", resource)
}

func init() {
	setJwks()

	// Spawn Oathkeeper Server
	cmd := exec.Command("oathkeeper", "--serve", "--config", "/etc/config/oathkeeper/config.yml")
	if err := cmd.Start(); err != nil {
		fmt.Printf("Error starting Oathkeeper server: %v\n", err)
		return
	}
}

func handler(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayCustomAuthorizerResponse, error) {

	fmt.Printf("Event: %v\n", event)
	fmt.Printf("Context: %v\n", ctx)

	resp, err := getDecisionsRequest(event).Execute()
	if resp == nil || err != nil {
		fmt.Printf("Error executing request: %v\n", err)
		return generateDeny("user", event.RequestContext.Path), nil
	}

	return generateAllow("user", event.RequestContext.Path, resp), nil
}

func main() {
	// Start Lambda handler
	lambda.Start(handler)
}
