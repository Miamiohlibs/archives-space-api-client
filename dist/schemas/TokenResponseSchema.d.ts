import { z } from "zod";
export declare const tokenResponseSchema: z.ZodUnion<readonly [z.ZodObject<{
    success: z.ZodLiteral<true>;
    token: z.ZodString;
    user: z.ZodAny;
    error: z.ZodOptional<z.ZodNever>;
}, z.core.$strip>, z.ZodObject<{
    success: z.ZodLiteral<false>;
    token: z.ZodOptional<z.ZodNever>;
    user: z.ZodOptional<z.ZodNever>;
    error: z.ZodObject<{
        status: z.ZodNumber;
        message: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>]>;
//# sourceMappingURL=TokenResponseSchema.d.ts.map