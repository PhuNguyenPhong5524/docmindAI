import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Tag, Avatar, message, Empty } from 'antd';
import {
  ShareAltOutlined,
  ReloadOutlined,
  CopyOutlined,
  LikeOutlined,
  CheckCircleOutlined,
  RobotOutlined,
  SyncOutlined
} from '@ant-design/icons';
import { ChatSidebar } from './components/ChatSidebar';
import { ChatSourcesPanel } from './components/ChatSourcesPanel';
import { ChatComposer } from './components/ChatComposer';
import { useDocuments } from '../../../hooks/user/useDocuments';
import { useAskQuestion, useChatHistory } from '../../../hooks/user/useChat';
import type { Citation, ChatMessage } from '../../../types/chat';

interface LocationState {
  documentId?: string;
}

interface UiMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  citations?: Citation[];
  createdAt?: string;
}

const toUiMessage = (item: ChatMessage): UiMessage => ({
  id: item._id,
  role: item.role,
  content: item.content,
  citations: item.citations || [],
  createdAt: item.createdAt,
});

export const UserChatPage: React.FC = () => {
  const location = useLocation();
  const initialDocumentId = (location.state as LocationState | null)?.documentId;

  const { data: documentsData, isLoading: isDocumentsLoading } = useDocuments();
  const readyDocuments = useMemo(() => {
    return (documentsData?.data || []).filter((doc) => doc.status === 'READY');
  }, [documentsData?.data]);

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | undefined>(initialDocumentId);
  const selectedDocument = readyDocuments.find((doc) => doc._id === selectedDocumentId);
  const historyQuery = useChatHistory(selectedDocumentId);
  const askMutation = useAskQuestion();
  const [messages, setMessages] = useState<UiMessage[]>([]);

  useEffect(() => {
    if (!selectedDocumentId && readyDocuments.length > 0) {
      setSelectedDocumentId(readyDocuments[0]._id);
    }
  }, [readyDocuments, selectedDocumentId]);

  useEffect(() => {
    if (initialDocumentId && readyDocuments.some((doc) => doc._id === initialDocumentId)) {
      setSelectedDocumentId(initialDocumentId);
    }
  }, [initialDocumentId, readyDocuments]);

  useEffect(() => {
    setMessages((historyQuery.data?.data || []).map(toUiMessage));
  }, [historyQuery.data?.data]);

  const handleSendMessage = async (question: string) => {
    if (!selectedDocumentId) {
      message.warning('Vui lòng chọn một tài liệu READY trước khi hỏi AI.');
      return;
    }

    const tempUserMessage: UiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMessage]);

    try {
      const response = await askMutation.mutateAsync({
        document_id: selectedDocumentId,
        question,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: response.answer,
          citations: response.citations,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => prev.filter((item) => item.id !== tempUserMessage.id));
      message.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    }
  };

  const renderCitations = (citations?: Citation[]) => {
    if (!citations?.length) return null;

    return (
      <div className="pt-3 border-t border-gray-200/70 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
          <span className="flex items-center gap-1.5"><CheckCircleOutlined className="text-emerald-600" /> Nguồn trích dẫn ({citations.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {citations.map((citation) => (
            <div key={`${citation.document_id}-${citation.page_number}`} className="bg-white p-3 rounded-xl border border-gray-200 text-xs hover:border-indigo-300 transition-all">
              <div className="font-mono text-[11px] text-indigo-600 font-semibold mb-1">
                {citation.document_name} · Trang {citation.page_number}
              </div>
              <p className="text-gray-500 line-clamp-3 text-[11px]">
                "{citation.excerpt}"
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] w-full flex overflow-hidden bg-gray-50">
      <ChatSidebar
        activeId={selectedDocumentId || ''}
        onSelectChat={setSelectedDocumentId}
        documents={readyDocuments}
      />

      <main className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="h-14 px-6 bg-white border-b border-gray-100 flex items-center justify-between shrink-0 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <RobotOutlined className="text-lg" />
            </div>
            <div className="flex flex-col min-w-0">
              <h1 className="text-sm font-bold text-gray-900 truncate">{selectedDocument?.display_name || 'Chat với tài liệu'}</h1>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-indigo-600 font-mono bg-indigo-50 px-1.5 py-0.2 rounded font-medium">
                  DOCMIND RAG
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-[11px] text-emerald-600 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Connected
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button type="text" icon={<ShareAltOutlined className="text-gray-500" />} />
            <Button type="text" icon={<ReloadOutlined className="text-gray-500" />} onClick={() => historyQuery.refetch()} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!selectedDocument && !isDocumentsLoading && (
            <Empty description="Chưa có tài liệu READY để hỏi AI" />
          )}

          {messages.map((item) => {
            if (item.role === 'user') {
              return (
                <div key={item.id} className="flex justify-end gap-3 max-w-4xl ml-auto">
                  <div className="flex flex-col items-end max-w-[80%]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-700">Bạn</span>
                    </div>
                    <div className="bg-indigo-600 text-white p-3.5 rounded-2xl rounded-tr-xs shadow-sm text-sm leading-relaxed">
                      {item.content}
                    </div>
                  </div>
                  <Avatar className="bg-indigo-700 shrink-0 font-bold">U</Avatar>
                </div>
              );
            }

            return (
              <div key={item.id} className="flex items-start gap-3.5 max-w-4xl">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <RobotOutlined className="text-lg" />
                </div>

                <div className="flex-1 space-y-3 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-indigo-600">DOCMIND RAG Engine</span>
                      <Tag color="indigo" className="m-0 text-[10px] font-mono font-semibold">Grounded QA</Tag>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <Button type="text" size="small" icon={<CopyOutlined />} />
                      <Button type="text" size="small" icon={<LikeOutlined />} />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl rounded-tl-xs border border-gray-100 space-y-4 text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
                    <p>{item.content}</p>
                    {renderCitations(item.citations)}
                  </div>
                </div>
              </div>
            );
          })}

          {(askMutation.isPending || historyQuery.isFetching) && (
            <div className="flex items-center gap-2 text-xs text-gray-500 pl-12">
              <SyncOutlined spin className="text-indigo-600" />
              <span>Đang đối chiếu vector ngữ nghĩa...</span>
            </div>
          )}
        </div>

        <ChatComposer
          onSendMessage={handleSendMessage}
          isGenerating={askMutation.isPending}
          selectedDocumentName={selectedDocument?.display_name}
          disabled={!selectedDocument}
        />
      </main>

      <ChatSourcesPanel
        documents={readyDocuments}
        selectedDocumentId={selectedDocumentId}
        onSelectDocument={setSelectedDocumentId}
      />
    </div>
  );
};

export default UserChatPage;
