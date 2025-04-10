import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: Request, response: Response) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    const postData = await request.json();

    const { gRecaptchaToken } = postData;
    let res;
    try {
        res = await axios.post(
            "https://www.google.com/recaptcha/api/siteverify",
            null,
            {
                params: {
                    secret: secretKey,
                    response: gRecaptchaToken,
                },
            }
        );

        console.log('res', res)


    } catch (e) {

        return NextResponse.json({ success: false })
    }

    if (res) {

        return NextResponse.json({
            success: true,
        });
    } else {
        console.log('res', res)
        return NextResponse.json({ success: false });
    }
}