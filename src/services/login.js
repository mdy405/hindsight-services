import pkg from "wstrade-api";
const { auth, accounts } = pkg;
import { getSessions, removeSessions, createSession } from "./session.js";

/**
 * Performs the login workflow for Wealthsimple Trade.
 *
 * @param {*} event
 * @returns
 */
export async function login(req, res) {
  try {
    let useSession = false;
    const postData = req.body;
    // Append otp if provided to us
    if (postData.otp) {
      auth.on("otp", postData.otp);
    } else {
      useSession = await reloadSession();
    }

    if (useSession) {
      res.status(200).send(auth.tokens());
    } else {
      // this will fail if OTP was not provided
      await auth.login(postData.email, postData.password);
      await createSession(auth.tokens());
      res.status(200).send(auth.tokens());
    }

    // Successful login: return the authentication tokens to the user
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

export const reloadSession = async () => {
  let retval = false;
  try {
    const credentials = await getSessions();
    if (credentials.length > 0) {
      let token = credentials[0];
      auth.use({
        access: token.access,
        refresh: token.refresh,
        expires: token.expires,
      });
    }

    try {
      await accounts.all();
      retval = true;
    } catch (error) {
      console.log("unable to resume session.");
      await removeSessions();
    }
  } catch (error) {
    console.log(error);
  }
  return retval;
};
