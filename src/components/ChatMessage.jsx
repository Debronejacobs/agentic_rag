import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  Paperclip,
  Bot,
  User,
  Copy,
  ThumbsUp,
  ThumbsDown,
  FileCode,
  Code
} from "lucide-react";
import Prism from 'prismjs';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/themes/prism-okaidia.css';
import { FixedSizeList as List } from 'react-window';

export default function ChatMessage() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const listRef = useRef();

  useEffect(() => {
    Prism.highlightAll();
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "40px";
      textareaRef.current.style.height = `${Math.min(120, textareaRef.current.scrollHeight)}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (inputValue.trim() === "") return;

    const newUserMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const Row = useCallback(({ index, style }) => {
    const message = messages[index];
    return (
      <div style={style} key={message.id} className="flex items-start space-x-3 py-2 px-2">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            {message.role === "assistant" ? <Bot size={20} /> : <User size={20} />}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {message.code ? (
            <div className="mt-0">
              <div className="rounded-lg overflow-hidden border">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <Code size={14} className="mr-2" />
                    <span className="text-sm font-medium text-gray-300">{message.code.language}</span>
                  </div>
                  <button className="text-sm text-gray-400 hover:text-white">
                    <Copy size={14} />
                  </button>
                </div>
                <div className="p-4 max-w-full">
                  <pre className="language-none whitespace-pre-wrap break-words">
                    <code className={`language-${message.code.language} whitespace-pre-wrap break-words`}>
                      {message.code.content}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl px-4 py-3 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {message.content}
            </div>
          )}

          {message.explanation && (
            <div className="mt-3">
              <div className="rounded-lg overflow-hidden border">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center">
                    <Code size={14} className="mr-2" />
                    <span className="text-sm font-medium text-gray-300">{message.code.language}</span>
                  </div>
                  <button className="text-sm text-gray-400 hover:text-white">
                    <Copy size={14} />
                  </button>
                </div>
                <div className="p-4 max-w-full">
                  <pre className="language-none whitespace-pre-wrap break-words">
                    <code className={`language-${message.code.language} whitespace-pre-wrap break-words`}>
                      {message.code.content}
                    </code>
                  </pre>
                </div>
              </div>
              <p className="mt-2 text-xs">{message.explanation}</p>
            </div>
          )}

          <div className="mt-1 text-xs">{message.timestamp}</div>

          {message.role === "assistant" && (
            <div className="flex mt-2 gap-2">
              <button className="p-1"><ThumbsUp size={14} /></button>
              <button className="p-1"><ThumbsDown size={14} /></button>
              <button className="p-1"><Copy size={14} /></button>
            </div>
          )}
        </div>
      </div>
    );
  }, [messages]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow overflow-hidden p-4">
        <div className="max-w-3xl mx-auto h-full">
          <List
            height={window.innerHeight - 250}
            itemCount={messages.length + (isTyping ? 1 : 0)}
            itemSize={160}
            width="100%"
            ref={listRef}
          >
            {({ index, style }) => {
              if (index === messages.length && isTyping) {
                return (
                  <div style={style} className="flex items-start space-x-3 py-2 px-2">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center">
                        <Bot size={20} />
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-xl px-4 py-3 border">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                );
              }
              return <Row index={index} style={style} />;
            }}
          </List>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <div className="rounded-lg border overflow-hidden">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Assistant..."
                className="w-full px-3 py-3 outline-none resize-none"
                rows={1}
                style={{ maxHeight: "120px" }}
              />
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex space-x-2">
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-200">
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="p-2 text-gray-400 hover:text-gray-200">
                    <FileCode size={18} />
                  </button>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={inputValue.trim() === ""}
                  className={`rounded-full p-2 ${
                    inputValue.trim() === ""
                      ? "bg-gray-600 text-gray-400"
                      : "bg-gray-500 text-gray-200 hover:bg-gray-600"
                  }`}
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs text-center text-gray-500">
          AI Assistant may produce inaccurate information about people, places, or facts.
          </div>
        </div>
      </div>
    </div>
  );
}
