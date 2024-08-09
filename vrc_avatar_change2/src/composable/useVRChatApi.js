import { fetch } from '@tauri-apps/plugin-http';

const sleep = (time) => new Promise((r) => setTimeout(r, time));

export async function checkAvailableToken(dto) {
  const api_base = "https://api.vrchat.cloud/api/1";
  const endpoint = `/avatars/${dto.id}/select`;
  const url = `${api_base}${endpoint}`;

  await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      Cookie: "auth=" + dto.authToken,
    },
  });
}

export async function execVRChatLogin(dto) {
  const username = dto.userName;
  const password = dto.password;
  const api_base = "https://api.vrchat.cloud/api/1";

  // apiKey取得
  const apiKey = await get_apiKey(api_base);

  // authToken取得
  const [authToken, cookies] = await get_authToken(
    api_base,
    apiKey,
    username,
    password
  );

  return { apiKey, authToken, cookies };
}

export async function execTwoFactorAuth(dto) {
  await twofa_vrc(dto.authToken, dto.num);
}

async function get_apiKey(api_base) {
  const endpoint = "/config";
  const url = api_base + endpoint;

  const response = await fetch(url, { method: "GET" });
  const data = await response.json();

  return data.clientApiKey;
}

async function get_authToken(api_base, apiKey, username, password) {
  const endpoint = "/auth/user";
  const url = `${api_base}${endpoint}?apiKey=${apiKey}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization:
        "Basic " + btoa(`${username}:${password}`),
    },
  });

  const cookies = response.headers.get("set-cookie");
  const authToken = extractAuthToken(cookies);

  if (authToken) {
    return [authToken, cookies, response.twoFactorAuthEnabled];
  }
}

function extractAuthToken(cookieString) {
  // 'auth='の部分を探す
  const authIndex = cookieString.indexOf("auth=");

  if (authIndex === -1) {
    return null; // 'auth='が見つからない場合
  }

  // 'auth='の後ろの値を取得する
  const startIndex = authIndex + "auth=".length;
  const endIndex = cookieString.indexOf(";", startIndex);

  // ';'が見つからない場合、文字列の最後までを取る
  const authToken =
    endIndex === -1
      ? cookieString.substring(startIndex)
      : cookieString.substring(startIndex, endIndex);

  return authToken;
}

export async function twofa_vrc(authToken, num) {
  const api_base = "https://api.vrchat.cloud/api/1";
  const endpoint = "/auth/twofactorauth/totp/verify";
  const url = `${api_base}${endpoint}`;

  const postData = {
    code: num.toString(),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Cookie: "auth=" + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  });

  const data = await response.json();

  console.info(data);
  // 認証成功するとtwofa_result = trueになります

  const twofa_result = data.verified;

  return twofa_result;
}

export async function execGetAvatarList(dto) {
  const api_base = "https://api.vrchat.cloud/api/1";
  const endpoint = "/avatars";
  const offset = 100 * dto.offsetMultiply;
  const url = `${api_base}${endpoint}?&releaseStatus=all&organization=vrchat&sort=updated&order=descending&user=me&n=100&offset=${offset}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers: {
      Cookie: "auth=" + dto.authToken,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const data = await response.json();

  return data;
}

export async function execChangeAvatar(dto) {
  const api_base = "https://api.vrchat.cloud/api/1";
  const endpoint = `/avatars/${dto.id}/select`;
  const url = `${api_base}${endpoint}`;

  await fetch(url, {
    method: "PUT",
    credentials: "include",
    headers: {
      Cookie: "auth=" + dto.authToken,
    },
  });
}

export async function execTokenCheck(dto) {
  const api_base = "https://api.vrchat.cloud/api/1";
  const endpoint = `/auth/user`;
  const url = `${api_base}${endpoint}`;

  const headers = new Headers()
  headers.append('Cookie',"auth=" + dto.authToken);

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
    headers,
  })  

  console.info(response);


  const data = await response.json();
  if (data.requiresTwoFactorAuth) {
    return false;
  }

  return response.status === 200;
}
