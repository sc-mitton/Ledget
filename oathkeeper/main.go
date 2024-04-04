package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/secretsmanager"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-secretsmanager-caching-go/secretcache"
	"github.com/ory/oathkeeper/driver"
	"github.com/ory/x/logrusx"
	"github.com/spf13/pflag"
)

var (
	version = "0.4.0"
	build   = "unknown"
	date    = "unknown"
	d       *driver.DefaultDriver
)

func generateAuthResponse(effect string, resource string) events.APIGatewayCustomAuthorizerResponse {
	authResponse := events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "user",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action: []string{"execute-api:Invoke"},
					Effect: effect,
					Resource: []string{
						"arn:aws:execute-api:*:*:*/*/*",
						resource,
					},
				},
			},
		},
	}

	return authResponse
}

func generateAllow(resource string, decision *http.Response) events.APIGatewayCustomAuthorizerResponse {
	authResponse := generateAuthResponse("Allow", resource)
	context := map[string]interface{}{}

	if decision.Header.Get("Authorization") != "" {
		context["authorization"] = decision.Header.Get("Authorization")
	}
	if decision.Header.Get("X-User") != "" {
		context["x-user"] = decision.Header.Get("X-User")
	}
	authResponse.Context = context

	return authResponse
}

func generateDeny(resource string) events.APIGatewayCustomAuthorizerResponse {
	return generateAuthResponse("Deny", resource)
}

func getCachedJwks() (map[string]interface{}, error) {

	var secretCache, _ = secretcache.New()

	result, err := secretCache.GetSecretString("oathkeeper_jwks")
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
	jwksFilePath := "/tmp/jwks.json"
	os.MkdirAll(filepath.Dir(jwksFilePath), 0755)

	jwksFile, err := os.Create(jwksFilePath)
	if err != nil {
		fmt.Printf("Failed to create JWKS file: %v\n", err)
		return
	}

	jwksFile.Write(jwksData)
	jwksFile.Close()
}

func init() {
	setJwks()

	configFile := "./config.yml"

	// Initialize Oathkeeper
	okFlags := pflag.NewFlagSet("ok", pflag.ContinueOnError)
	okFlags.String("config", configFile, "Path to the config file")
	logger := logrusx.New("ORY Oathkeeper", version)

	d := driver.NewDefaultDriver(logger, version, build, date, okFlags)
	d.Registry().Init()
}

func getDecision(event events.APIGatewayProxyRequest) (*http.Response, error) {

	req, err := http.NewRequest(event.HTTPMethod, event.Path, nil)
	req.Header.Add("X-Forwarded-For", event.RequestContext.Identity.SourceIP)
	req.Header.Add("X-Forwarded-Proto", event.RequestContext.Protocol)
	req.Header.Add("X-Forwarded-Host", event.RequestContext.DomainName)
	req.Header.Add("X-Forwarded-Uri", event.Path)
	req.Header.Add("X-Forwarded-For", event.RequestContext.Identity.SourceIP)
	req.Header.Add("Cookie", event.Headers["Cookie"])

	if err != nil {
		return nil, err
	}

	next := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {})
	rw := httptest.NewRecorder()
	d.Registry().DecisionHandler().ServeHTTP(rw, req, next)

	return rw.Result(), nil
}

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayCustomAuthorizerResponse, error) {
	decision, err := getDecision(event)

	fmt.Println("event: ", event)

	if err != nil {
		return generateDeny(event.Path), err
	} else {
		return generateAllow(event.Path, decision), nil
	}
}

func main() {
	// Start Lambda handler
	lambda.Start(HandleRequest)
}
