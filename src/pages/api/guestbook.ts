import type { APIRoute } from "astro";
import { clerkClient } from "@clerk/astro/server";
import { queryBuilder } from "../../db/planetscale";
import { getGuestbook } from "../../utils";

export const POST: APIRoute = async (context) => {
  const { request, locals } = context
  if (request.headers.get("Content-Type") !== "application/json") {
    return new Response(
      JSON.stringify({
        message: "Method not allowed",
      }),
      { status: 405 },
    );
  }

  const body = await request.json();
  const { message } = body;
  try {
    const auth = locals.auth();

    if (!auth.userId) {
      throw new Error("not logged in");
    }

    let user;
    try {
      user = await clerkClient(context).users.getUser(auth.userId);
    } catch (e) {
      return new Response(
        JSON.stringify({
          message: "User not found",
        }),
        { status: 400 },
      );
    }
    const { primaryEmailAddressId, username } = user || {};

    if (!primaryEmailAddressId) throw new Error("Email not found");
    if (!username) throw new Error("username not found");

    await queryBuilder
      .insertInto("guestbook")
      .values({
        email: primaryEmailAddressId,
        message,
        created_by: username,
      })
      .executeTakeFirst();

    return new Response(
      JSON.stringify({
        error: null,
      }),
      {
        status: 200,
      },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
      }),
      { status: 500 },
    );
  }
};

export const get: APIRoute = async () => {
  try {
    const result = await getGuestbook();

    return new Response(JSON.stringify(result), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
      }),
      { status: 500 },
    );
  }
};
