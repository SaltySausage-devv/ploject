<template>
  <div class="messages-page">
    <div class="container py-5">
      <div class="row">
        <!-- Conversations Sidebar -->
        <div class="col-lg-4 mb-4">
          <motion.div
            :initial="{ opacity: 0, x: -30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6 }"
            class="card border-0 shadow-sm h-100"
          >
            <div class="card-header bg-white border-bottom">
              <div class="d-flex align-items-center justify-content-between">
                <h5 class="fw-bold mb-0">
                  <i class="fas fa-comments me-2 text-primary"></i>
                  Messages
                </h5>
                <button class="btn btn-primary btn-sm" @click="startNewConversation">
                  <i class="fas fa-plus me-1"></i>
                  New
                </button>
              </div>
            </div>
            <div class="card-body p-0">
              <!-- Search -->
              <div class="p-3 border-bottom">
                <div class="input-group">
                  <span class="input-group-text">
                    <i class="fas fa-search"></i>
                  </span>
                  <input
                    type="text"
                    v-model="searchQuery"
                    class="form-control"
                    placeholder="Search conversations..."
                  />
                </div>
              </div>

              <!-- Conversations List -->
              <div class="conversations-list">
                <div v-if="filteredConversations.length === 0" class="text-center py-4">
                  <i class="fas fa-inbox text-muted fs-1 mb-3"></i>
                  <p class="text-muted">No conversations yet</p>
                </div>
                <div v-else>
                  <div
                    v-for="(conversation, index) in filteredConversations"
                    :key="conversation.id"
                    class="conversation-item p-3 border-bottom cursor-pointer"
                    :class="{ 'active': selectedConversation?.id === conversation.id }"
                    @click="selectConversation(conversation)"
                  >
                    <motion.div
                      :initial="{ opacity: 0, x: -20 }"
                      :animate="{ opacity: 1, x: 0 }"
                      :transition="{ duration: 0.4, delay: index * 0.1 }"
                    >
                      <div class="d-flex align-items-start">
                        <div class="conversation-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3 spring-smooth" style="width: 45px; height: 45px;">
                          <i class="fas fa-user text-primary"></i>
                        </div>
                        <div class="flex-grow-1">
                          <h6 class="fw-bold mb-1">{{ conversation.participant.name }}</h6>
                          <p class="text-muted mb-1 small">{{ conversation.lastMessage }}</p>
                          <small class="text-muted">{{ formatTime(conversation.lastMessageAt) }}</small>
                        </div>
                        <div v-if="conversation.unreadCount > 0" class="badge bg-primary rounded-pill">
                          {{ conversation.unreadCount }}
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <!-- Chat Area -->
        <div class="col-lg-8">
          <motion.div
            :initial="{ opacity: 0, x: 30 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ duration: 0.6, delay: 0.1 }"
            class="card border-0 shadow-sm h-100"
          >
            <!-- Chat Header -->
            <div class="card-header bg-white border-bottom" v-if="selectedConversation">
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div class="chat-avatar bg-primary bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px;">
                    <i class="fas fa-user text-primary"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0">{{ selectedConversation.participant.name }}</h6>
                    <small class="text-muted">{{ selectedConversation.participant.type }}</small>
                  </div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-phone"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-video"></i>
                  </button>
                  <button class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-ellipsis-v"></i>
                  </button>
                </div>
              </div>
            </div>

            <!-- Messages Area -->
            <div class="card-body p-0 d-flex flex-column" style="height: 500px;">
              <div v-if="!selectedConversation" class="d-flex align-items-center justify-content-center h-100">
                <div class="text-center">
                  <i class="fas fa-comments text-muted fs-1 mb-3"></i>
                  <h5 class="text-muted">Select a conversation</h5>
                  <p class="text-muted">Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>

              <div v-else class="messages-container flex-grow-1 p-3 overflow-auto">
                <div v-if="messages.length === 0" class="text-center py-4">
                  <i class="fas fa-comment-dots text-muted fs-1 mb-3"></i>
                  <p class="text-muted">No messages yet</p>
                  <p class="text-muted small">Start the conversation by sending a message</p>
                </div>
                <div v-else>
                  <motion.div
                    v-for="(message, index) in messages"
                    :key="message.id"
                    :initial="{ opacity: 0, y: 20 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.05 }"
                    class="message-item mb-3"
                    :class="{ 'sent': message.senderId === currentUserId, 'received': message.senderId !== currentUserId }"
                  >
                    <div class="d-flex" :class="{ 'justify-content-end': message.senderId === currentUserId }">
                      <div class="message-bubble" :class="{ 'sent': message.senderId === currentUserId, 'received': message.senderId !== currentUserId }">
                        <div v-if="message.messageType === 'text'" class="message-content">
                          {{ message.content }}
                        </div>
                        <div v-else-if="message.messageType === 'file'" class="message-content">
                          <div class="d-flex align-items-center">
                            <i class="fas fa-file me-2"></i>
                            <span>{{ message.fileName }}</span>
                          </div>
                        </div>
                        <div class="message-time">
                          {{ formatTime(message.createdAt) }}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              <!-- Message Input -->
              <div v-if="selectedConversation" class="message-input p-3 border-top">
                <form @submit.prevent="sendMessage" class="d-flex gap-2">
                  <div class="flex-grow-1">
                    <input
                      type="text"
                      v-model="newMessage"
                      class="form-control"
                      placeholder="Type a message..."
                      :disabled="isLoading"
                    />
                  </div>
                  <button type="button" class="btn btn-outline-secondary" @click="attachFile">
                    <i class="fas fa-paperclip"></i>
                  </button>
                  <button type="submit" class="btn btn-primary" :disabled="!newMessage.trim() || isLoading">
                    <span v-if="isLoading" class="spinner me-1"></span>
                    <i v-else class="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

export default {
  name: 'Messages',
  setup() {
    const authStore = useAuthStore()
    
    const currentUserId = computed(() => authStore.user?.id)
    const searchQuery = ref('')
    const selectedConversation = ref(null)
    const conversations = ref([])
    const messages = ref([])
    const newMessage = ref('')
    const isLoading = ref(false)

    const filteredConversations = computed(() => {
      if (!searchQuery.value) return conversations.value
      return conversations.value.filter(conv => 
        conv.participant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    })

    const formatTime = (dateString) => {
      const date = new Date(dateString)
      const now = new Date()
      const diff = now - date
      
      if (diff < 60000) return 'Just now'
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
      return date.toLocaleDateString()
    }

    const loadConversations = async () => {
      // Simulate API call
      conversations.value = [
        {
          id: 1,
          participant: { name: 'Dr. Sarah Chen', type: 'Tutor' },
          lastMessage: 'Thanks for the session today!',
          lastMessageAt: new Date(Date.now() - 300000).toISOString(),
          unreadCount: 2
        },
        {
          id: 2,
          participant: { name: 'Mr. David Lim', type: 'Tutor' },
          lastMessage: 'See you tomorrow at 2 PM',
          lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 0
        },
        {
          id: 3,
          participant: { name: 'Excel Math Centre', type: 'Centre' },
          lastMessage: 'Your booking has been confirmed',
          lastMessageAt: new Date(Date.now() - 86400000).toISOString(),
          unreadCount: 1
        }
      ]
    }

    const selectConversation = async (conversation) => {
      selectedConversation.value = conversation
      await loadMessages(conversation.id)
    }

    const loadMessages = async (conversationId) => {
      // Simulate API call
      messages.value = [
        {
          id: 1,
          senderId: 2,
          content: 'Hello! I\'m looking for a math tutor for my daughter.',
          messageType: 'text',
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: 2,
          senderId: 1,
          content: 'Hi! I\'d be happy to help. What level is she at?',
          messageType: 'text',
          createdAt: new Date(Date.now() - 3500000).toISOString()
        },
        {
          id: 3,
          senderId: 2,
          content: 'She\'s in Secondary 3. She needs help with Additional Mathematics.',
          messageType: 'text',
          createdAt: new Date(Date.now() - 3400000).toISOString()
        },
        {
          id: 4,
          senderId: 1,
          content: 'Perfect! I specialize in A-Math. Would you like to schedule a trial session?',
          messageType: 'text',
          createdAt: new Date(Date.now() - 3300000).toISOString()
        }
      ]
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversation.value) return

      isLoading.value = true
      
      try {
        // Simulate API call
        const message = {
          id: Date.now(),
          senderId: currentUserId.value,
          content: newMessage.value,
          messageType: 'text',
          createdAt: new Date().toISOString()
        }
        
        messages.value.push(message)
        newMessage.value = ''
      } catch (error) {
        console.error('Send message error:', error)
      } finally {
        isLoading.value = false
      }
    }

    const startNewConversation = () => {
      // Navigate to search or show new conversation modal
      console.log('Start new conversation')
    }

    const attachFile = () => {
      // Handle file attachment
      console.log('Attach file')
    }

    onMounted(() => {
      loadConversations()
    })

    return {
      currentUserId,
      searchQuery,
      selectedConversation,
      conversations,
      messages,
      newMessage,
      isLoading,
      filteredConversations,
      formatTime,
      selectConversation,
      sendMessage,
      startNewConversation,
      attachFile
    }
  }
}
</script>

<style scoped>
.messages-page {
  background-color: var(--light-bg);
  min-height: 100vh;
}

.conversation-item {
  transition: all 0.3s ease;
  cursor: pointer;
}

.conversation-item:hover {
  background-color: var(--light-bg);
}

.conversation-item.active {
  background-color: var(--primary-color);
  color: white;
}

.conversation-item.active .text-muted {
  color: rgba(255, 255, 255, 0.8) !important;
}

.conversation-avatar,
.chat-avatar {
  transition: all 0.3s ease;
}

.conversation-item:hover .conversation-avatar {
  transform: scale(1.1);
  background-color: var(--primary-color) !important;
}

.conversation-item:hover .conversation-avatar i {
  color: white !important;
}

.messages-container {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
}

.message-bubble.sent {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  margin-left: auto;
}

.message-bubble.received {
  background: white;
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
  margin-top: 4px;
}

.message-input {
  background: white;
}

.btn-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
}

.form-control:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
}

@media (max-width: 768px) {
  .messages-container {
    height: 400px !important;
  }
  
  .message-bubble {
    max-width: 85%;
  }
}
</style>
