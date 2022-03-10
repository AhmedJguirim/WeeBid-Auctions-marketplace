import axios from 'axios';

const resources = {};

// TODO: implement this
//this file is responsible for : canceling requests that are running while the user types more in the textfield + it cashes responses
const makeRequestCreator = () => {
  let cancel;

  return async query => {
    if (cancel) {
      // Cancel the previous request before making a new request
      cancel.cancel();
    }
    // Create a new CancelToken
    cancel = axios.CancelToken.source();
    try {
      if (resources[query]) {
        // Return result if it exists
        return resources[query];
      }
      const res = await axios.get(query, { cancelToken: cancel.token });

      const result = res.data.results;
      // Store response
      resources[query] = result;

      return result;
    } catch (error) {
      if (axios.isCancel(error)) {
        // Handle if request was cancelled
        console.log('Request canceled', error.message);
      } else {
        // Handle usual errors
        console.log('Something went wrong: ', error.message);
      }
    }
  };
};

export const search = makeRequestCreator()