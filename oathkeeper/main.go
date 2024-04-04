package main

import (
	"context"
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func init() {
	fmt.Println("init")
}

func HandleRequest(ctx context.Context, event events.APIGatewayProxyRequest) (events.APIGatewayCustomAuthorizerResponse, error) {

	fmt.Println("Hello, World!")

	return events.APIGatewayCustomAuthorizerResponse{
		PrincipalID: "user",
		PolicyDocument: events.APIGatewayCustomAuthorizerPolicy{
			Version: "2012-10-17",
			Statement: []events.IAMPolicyStatement{
				{
					Action:   []string{"execute-api:Invoke"},
					Effect:   "Allow",
					Resource: []string{"*"},
				},
			},
		},
	}, nil
}

func main() {
	lambda.Start(HandleRequest)
}
