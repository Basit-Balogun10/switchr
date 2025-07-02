import { Password } from "@convex-dev/auth/providers/Password";

export default {
  providers: [
    Password({
      profile(params: any) {
        return {
          email: params.email as string,
          fullName: params.fullName as string,
          userType: params.userType as "user" | "provider" | "station_partner" | "admin",
        };
      },
    }),
  ],
};
