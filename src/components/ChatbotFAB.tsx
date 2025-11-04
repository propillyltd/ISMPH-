import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY } from '../constants/theme';
import { MessageCircle, X, Send, Bot } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const AI_RESPONSES: Record<string, string> = {
  hello: 'Hello! I\'m your ISMPH AI Assistant. How can I help you today?',
  cholera: 'Cholera is a bacterial infection. Symptoms include diarrhea and dehydration. Prevention includes clean water and hygiene. Should I provide more details?',
  report: 'To submit a report, go to the Reports tab and tap the + button. You can report facility issues, equipment shortages, or service quality concerns.',
  phc: 'Primary Healthcare Centers (PHCs) provide basic health services. You can find nearby PHCs in the Feedback tab by tapping "Find PHC".',
  emergency: 'For medical emergencies, please call 112 or visit the nearest hospital immediately. This app is for reporting and tracking, not emergency response.',
  default: 'I understand your question. For specific health concerns, please consult a healthcare professional or visit your nearest PHC.',
};

export const ChatbotFAB: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to ISMPH AI Assistant! I can help you with health information, finding PHCs, submitting reports, and answering questions about diseases.',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return AI_RESPONSES.hello;
    }
    if (lowerMessage.includes('cholera')) {
      return AI_RESPONSES.cholera;
    }
    if (lowerMessage.includes('report')) {
      return AI_RESPONSES.report;
    }
    if (lowerMessage.includes('phc') || lowerMessage.includes('clinic') || lowerMessage.includes('hospital')) {
      return AI_RESPONSES.phc;
    }
    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return AI_RESPONSES.emergency;
    }
    
    return AI_RESPONSES.default;
  };

  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(inputText),
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <>
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setVisible(true)}
      >
        <MessageCircle size={24} color={COLORS.white} />
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.botIcon}>
                <Bot size={24} color={COLORS.white} />
              </View>
              <View>
                <Text style={styles.headerTitle}>ISMPH AI Assistant</Text>
                <Text style={styles.headerSubtitle}>Online • Instant replies</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <X size={24} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.messagesContainer} contentContainerStyle={styles.messagesContent}>
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.isUser ? styles.userMessage : styles.aiMessage,
                ]}
              >
                <Text style={[styles.messageText, message.isUser && styles.userMessageText]}>
                  {message.text}
                </Text>
                <Text style={[styles.messageTime, message.isUser && styles.userMessageTime]}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask about health, diseases, PHCs..."
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={handleSend}
              multiline
              placeholderTextColor={COLORS.textSecondary}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
              <Send size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.info,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  botIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPOGRAPHY.body1,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: 16,
    marginBottom: SPACING.sm,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
  },
  messageText: {
    ...TYPOGRAPHY.body2,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userMessageText: {
    color: COLORS.white,
  },
  messageTime: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  userMessageTime: {
    color: COLORS.white,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: SPACING.sm,
  },
  input: {
    flex: 1,
    ...TYPOGRAPHY.body1,
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
