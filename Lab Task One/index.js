$('#sign-up').validate({
  rules: {
    mail: {
      required: true,
      email: true,
    },
    pass: {
      required: true,
      minlength: 8,
    },
    first: {
      required: true,
    },
    last: {
      required: true,
    },
  },
  messages: {
    mail: {
      required: 'Please enter your email address',
      email: 'Please enter correct email',
    },
    pass: {
      required: 'Please enter your password',
      minlength: 'Please enter at least 8 characters',
    },
    first: {
      required: 'Please enter first name',
    },
    last: {
      required: 'Please enter last name',
    },
  },
});
