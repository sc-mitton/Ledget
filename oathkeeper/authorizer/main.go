package main

import (
	"context"
	"net/http"
	"net/http/httptest"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/ory/oathkeeper/driver"
	"github.com/ory/x/logrusx"
	"github.com/spf13/pflag"
)

var (
	version = "0.4.0"
	build   = "unknown"
	date    = "unknown"
)

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

func generateAllow(principalID string, resource string, decision *http.Response) events.APIGatewayCustomAuthorizerResponse {
	policy := generatePolicy(principalID, "Allow", resource)
	policy.Context = map[string]interface{}{
		"authorizer": decision.Header.Get("Authorization"),
		"x-user":     decision.Header.Get("X-User"),
	}
	return policy
}

func generateDeny(principalID string, resource string) events.APIGatewayCustomAuthorizerResponse {
	return generatePolicy(principalID, "Deny", resource)
}

func getDecision(event events.APIGatewayProxyRequest) (*http.Response, error) {

	okFlags := pflag.NewFlagSet("ok", pflag.ContinueOnError)
	okFlags.String("config", "./config.yml", "Path to the config file")
	logger := logrusx.New("ORY Oathkeeper", version)

	d := driver.NewDefaultDriver(logger, version, build, date, okFlags)
	d.Registry().Init()

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

	if err != nil {
		return generateDeny("user", event.Path), err
	} else {
		return generateAllow("user", event.Path, decision), nil
	}
}

func main() {
	// Start Lambda handler
	lambda.Start(HandleRequest)
}
