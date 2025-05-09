import { ChatGPTMessage } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function scrollToBottom(containerRef: React.RefObject<HTMLElement>) {
  if (containerRef.current) {
    const lastMessage = containerRef.current.lastElementChild;
    if (lastMessage) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: "smooth",
        block: "end",
      };
      lastMessage.scrollIntoView(scrollOptions);
    }
  }
}

// Reference:
// github.com/hwchase17/langchainjs/blob/357d6fccfc78f1332b54d2302d92e12f0861c12c/examples/src/guides/expression_language/cookbook_conversational_retrieval.ts#L61
export const formatChatHistory = (chatHistory: [string, string][]) => {
  const formattedDialogueTurns = chatHistory.map(
    (dialogueTurn) => `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`
  );

  return formattedDialogueTurns.join("\n");
};

export function formattedText(inputText: string) {
  return inputText
    .replace(/\n+/g, " ") // Replace multiple consecutive new lines with a single space
    .replace(/(\w) - (\w)/g, "$1$2") // Join hyphenated words together
    .replace(/\s+/g, " "); // Replace multiple consecutive spaces with a single space
}

// Default UI Message
export const initialMessages = [
  {
    role: "assistant",
    content:
      "Xin chào tôi là trợ lý Mobifone 7 của bạn. Mời bạn hỏi tôi về chính sách CSKH của MobiFone nhé",
  },
];

interface Data {
  sources: string[];
}

// Maps the sources with the right ai-message
export const getSources = (data: Data[], role: string, index: number) => {
  if (role === "assistant" && index >= 2 && (index - 2) % 2 === 0) {
    const sourcesIndex = (index - 2) / 2;
    if (data[sourcesIndex] && data[sourcesIndex].sources) {
      return data[sourcesIndex].sources;
    }
  }
  return [];
};

export const convertKeyToProvinceObject = (key: string) => {
  switch (key) {
    case "KHO": return { value: "KHO", label: "Khánh Hòa" };
    case "DLA": return { value: "DLA", label: "Đăk Lăk" };
    case "GLA": return { value: "GLA", label: "Gia Lai" };
    case "PYE": return { value: "PYE", label: "Phú Yên" };
    case "DNO": return { value: "DNO", label: "Đăk Nông" };
    case "KON": return { value: "KON", label: "Kon Tum" };
    case "CTY7": return { value: "CTY7", label: "VP Công ty" };

    default:
      return { value: "", label: "Không xác định" }
  }

}
