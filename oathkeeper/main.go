package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/lambda"
)

func Handle() {
	fmt.Println("Hello, World!")
}

func main() {
	lambda.Start(Handle)
}
