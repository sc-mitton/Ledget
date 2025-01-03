export const formatErrorMessages = (
  errorMessages: { id: number; [key: string]: any }[]
) => {
  const filteredMessages: string[] = [];
  for (const message of errorMessages) {
    switch (message.id) {
      case 4000006:
        filteredMessages.push('Wrong email or password.');
        break;
      case 4000007:
        filteredMessages.push("Hmm, something's not right. Please try again.");
        break;
      case 4000008:
        break;
      default:
        filteredMessages.push(
          "Hmm, something's not right. Please try again later."
        );
        break;
    }
  }
  return filteredMessages;
};

export const extractData: React.FormEventHandler<HTMLFormElement> = (event) => {
  // map the entire form data to JSON for the request body
  const formData = new FormData(event.target as any);
  let body = Object.fromEntries(formData as any);

  // remove empty values
  body = Object.fromEntries(Object.entries(body).filter(([_, v]) => v !== ''));

  // We need the method specified from the name and value of the submit button.
  // when multiple submit buttons are present, the clicked one's value is used.
  // We need the method specified from the name and value of the submit button.
  // when multiple submit buttons are present, the clicked one's value is used.
  if ('submitter' in event.nativeEvent) {
    const method = event.nativeEvent.submitter as HTMLButtonElement;
    body = {
      ...body,
      ...{ [method.name]: method.value },
    };
  }
  return body;
};
