import { useEffect, useRef, useState } from "react";
import * as S from "./styles";

const INITIAL_MESSAGE = {
    role: "assistant",
    content: "Olá! Sou o assistente do Recanto Vila Rica. Como posso te ajudar? 😊",
};

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    async function sendMessage() {
        if (!input.trim() || loading) return;

        const userMessage = { role: "user", content: input.trim() };
        const updatedMessages = [...messages, userMessage];

        setMessages(updatedMessages);
        setInput("");
        setLoading(true);
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        try {
            const userData = JSON.parse(localStorage.getItem("recanto:userData") || "{}");
            const token = userData?.token;

            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { Authorization: `Bearer ${token}` }),
                },
                body: JSON.stringify({ messages: updatedMessages.slice(-20) }),
            });

            if (!response.ok) {
                throw new Error("Erro na resposta do servidor");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const lines = decoder
                    .decode(value)
                    .split("\n")
                    .filter((l) => l.startsWith("data: "));

                for (const line of lines) {
                    const raw = line.replace("data: ", "");
                    if (raw === "[DONE]") break;

                    try {
                        const parsed = JSON.parse(raw);
                        if (parsed.error) throw new Error(parsed.error);

                        setMessages((prev) => {
                            const updated = [...prev];
                            updated[updated.length - 1] = {
                                role: "assistant",
                                content: updated[updated.length - 1].content + parsed.text,
                            };
                            return updated;
                        });
                    } catch {
                        // chunk incompleto, ignorar
                    }
                }
            }
        } catch {
            setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    role: "assistant",
                    content: "Desculpe, ocorreu um erro. Tente novamente em instantes.",
                };
                return updated;
            });
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }

    return (
        <>
            <S.Fab onClick={() => setOpen((o) => !o)} aria-label="Abrir chat">
                {open ? "✕" : "💬"}
            </S.Fab>

            {open && (
                <S.Window>
                    <S.Header>Assistente Recanto Vila Rica</S.Header>

                    <S.Messages>
                        {messages.map((msg, i) => (
                            <S.Bubble key={i} $role={msg.role}>
                                {msg.content ||
                                    (loading && i === messages.length - 1 ? "..." : "")}
                            </S.Bubble>
                        ))}
                        <div ref={bottomRef} />
                    </S.Messages>

                    <S.InputRow>
                        <S.Input
                            ref={inputRef}
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Digite sua dúvida..."
                            disabled={loading}
                            maxLength={2000}
                        />
                        <S.SendBtn
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                        >
                            Enviar
                        </S.SendBtn>
                    </S.InputRow>
                </S.Window>
            )}
        </>
    );
}
