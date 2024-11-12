import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const POST = async (req: Request) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ message: "Method Not Allowed" }), { status: 405 });
    }

    try {
        const { message } = await req.json();

        if (!message) {
            return new Response(JSON.stringify({ message: "Message content is required" }), { status: 400 });
        }

        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
            model: "llama3-70b-8192",
        });

        return new Response(
            JSON.stringify({ message: response.choices[0]?.message?.content || "No response" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error with Groq API:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
};
