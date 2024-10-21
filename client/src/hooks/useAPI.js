import { useCallback } from "react";
import { STRINGS } from "../../utils/strings";

/**
 * A custom hook for making API requests.
 *
 * @returns {Object} An object containing functions for making
 * POST, GET, PUT, and DELETE requests.
 * @property {Function} postAPI - A function for making a POST request.
 * @property {Function} getAPI - A function for making a GET request.
 * @property {Function} putAPI - A function for making a PUT request.
 * @property {Function} deleteAPI - A function for making a DELETE request.
 */
export const useAPI = () => {
  async function postAPI(token, data, endpoint) {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
      console.error("Error making POST request:", error);
      throw error;
    }
  }
  // useCallback
  const getAPI = useCallback(async (token, data ,endpoint) => {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
      console.error("Error making GET request:", error);
      throw error;
    }
  }, []);

  async function putAPI(token, data, endpoint) {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
      console.error("Error making PUT request:", error);
      throw error;
    }
  }

  async function deleteAPI(token, data ,endpoint) {
    try {
      const response = await fetch(`${STRINGS.BASE_URL}/${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      return response.json();
    } catch (error) {
      console.error("Error making DELETE request:", error);
      throw error;
    }
  }

  return { postAPI, getAPI, deleteAPI, putAPI };
};
