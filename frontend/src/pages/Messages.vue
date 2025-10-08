<template>
  <div class="messages-page">
    <div class="container py-5">
      <div class="row">
        <!-- Conversations Sidebar -->
        <div class="col-lg-4 mb-4">
          <div class="card border-0 shadow-sm h-100">
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
                    <div>
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
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div class="col-lg-8">
          <div
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
                  <div
                    v-for="(message, index) in messages"
                    :key="message.id"
                    :initial="{ opacity: 0, y: 20 }"
                    :animate="{ opacity: 1, y: 0 }"
                    :transition="{ duration: 0.4, delay: index * 0.05 }"
                    class="message-item mb-3"
                    :class="{ 'sent': message.senderId === currentUserId, 'received': message.senderId !== currentUserId }"
                  >
                    <div class="d-flex" :class="{ 'justify-content-end': message.senderId === currentUserId }">
                      <div class="message-bubble" :class="{ 'sent': message.senderId === currentUserId, 'received': message.senderId !== currentUserId }"
                           @contextmenu.prevent="showMessageContextMenu($event, message)">
                        <div v-if="message.messageType === 'text'" class="message-content">
                          {{ message.content }}
                        </div>
                        <div v-else-if="message.messageType === 'file'" class="message-content">
                          <div class="d-flex align-items-center">
                            <i class="fas fa-file me-2"></i>
                            <span>{{ message.fileName }}</span>
                          </div>
                        </div>
                        <div class="message-footer">
                        <div class="message-time">
                          {{ formatTime(message.createdAt) }}
                        </div>
                          <div class="message-status" v-if="message.senderId === currentUserId">
                            <span v-if="message.readAt" class="status-read" title="Read">✓✓</span>
                            <span v-else-if="message.deliveredAt" class="status-delivered" title="Delivered">✓✓</span>
                            <span v-else class="status-sent" title="Sent">✓</span>
                      </div>
                    </div>
                      </div>
                    </div>
                  </div>
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
          </div>
        </div>
      </div>
    </div>

    <!-- Tutor Selection Modal -->
    <div v-if="showTutorSelection" class="modal-overlay" @click="showTutorSelection = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Select a Tutor</h3>
          <button @click="showTutorSelection = false" class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div v-if="availableTutors.length === 0" class="no-tutors">
            <p>No available tutors found.</p>
          </div>
          <div v-else class="tutor-list">
            <div 
              v-for="tutor in availableTutors" 
              :key="tutor.id"
              class="tutor-item"
              @click="createConversationWithTutor(tutor.id)"
            >
              <div class="tutor-info">
                <h4>{{ tutor.first_name }} {{ tutor.last_name }}</h4>
                <p>{{ tutor.email }}</p>
              </div>
              <div class="tutor-actions">
                <button class="btn btn-primary">Start Chat</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import messagingService from '../services/messaging.js'

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
      try {
        isLoading.value = true
        const response = await messagingService.getConversations()
        
        conversations.value = response.conversations.map(conv => {
          // Determine the other participant
          const otherParticipant = conv.participant1_id === currentUserId.value 
            ? conv.participant2 
            : conv.participant1
          
          return {
            id: conv.id,
            participant: {
              id: otherParticipant.id,
              name: `${otherParticipant.first_name} ${otherParticipant.last_name}`,
              type: otherParticipant.user_type
            },
            lastMessage: conv.last_message_content || 'No messages yet',
            lastMessageAt: conv.last_message_at || conv.created_at,
            unreadCount: 0 // Will be calculated by backend
          }
        })
      } catch (error) {
        console.error('Error loading conversations:', error)
        conversations.value = []
        // Show user-friendly error message
        alert('Failed to load conversations. Please refresh the page and try again.')
      } finally {
        isLoading.value = false
      }
    }

    const selectConversation = async (conversation) => {
      selectedConversation.value = conversation
      await loadMessages(conversation.id)
    }

    const loadMessages = async (conversationId) => {
      try {
        isLoading.value = true
        const response = await messagingService.getMessages(conversationId)
      messages.value = response.messages.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        content: msg.content,
        messageType: msg.message_type,
        createdAt: msg.created_at,
        readAt: msg.read_at,
        deliveredAt: msg.delivered_at,
        sender: msg.sender ? {
          name: `${msg.sender.first_name} ${msg.sender.last_name}`,
          type: msg.sender.user_type
        } : null
      }))
        
        // Mark messages as read and update status
        await messagingService.markAsRead(conversationId)
        
        // Update message status in local state
        messages.value.forEach(msg => {
          if (msg.senderId !== currentUserId.value && !msg.readAt) {
            msg.readAt = new Date().toISOString()
          }
        })
      } catch (error) {
        console.error('Error loading messages:', error)
        messages.value = []
        alert('Failed to load messages. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const sendMessage = async () => {
      if (!newMessage.value.trim() || !selectedConversation.value) {
        return
      }

      const messageContent = newMessage.value.trim()
      const conversationId = selectedConversation.value.id

      isLoading.value = true
      
      try {
        // Add message to local state immediately for better UX
        const tempMessage = {
          id: `temp_${Date.now()}`,
          senderId: currentUserId.value,
          content: messageContent,
          messageType: 'text',
          createdAt: new Date().toISOString(),
          sender: {
            name: `${authStore.user?.first_name} ${authStore.user?.last_name}`,
            type: authStore.user?.user_type
          }
        }
        
        messages.value.push(tempMessage)
        
        // Clear input immediately
        newMessage.value = ''
        
        // Send message via Socket.io (real-time)
        messagingService.sendMessage(conversationId, messageContent, 'text')
        
      } catch (error) {
        console.error('Send message error:', error)
        // Remove the temp message if sending failed
        messages.value = messages.value.filter(msg => msg.id !== `temp_${Date.now()}`)
        alert('Failed to send message. Please try again.')
      } finally {
        isLoading.value = false
      }
    }

    const availableTutors = ref([])
    const showTutorSelection = ref(false)
    const selectedTutorId = ref(null)

    const loadAvailableTutors = async () => {
      try {
        const response = await messagingService.getAvailableTutors()
        availableTutors.value = response.tutors || []
      } catch (error) {
        console.error('Error loading tutors:', error)
        availableTutors.value = []
      }
    }

    const startNewConversation = async () => {
      try {
        // Load available tutors first
        await loadAvailableTutors()
        showTutorSelection.value = true
      } catch (error) {
        console.error('Error loading tutors:', error)
        alert('Failed to load available tutors: ' + error.message)
      }
    }

    const createConversationWithTutor = async (tutorId) => {
      try {
        showTutorSelection.value = false
        
        // First try to find existing conversation in current list
        const existingConversation = conversations.value.find(conv => 
          conv.participant.id === tutorId
        )
        
        if (existingConversation) {
          // Use existing conversation
          await selectConversation(existingConversation)
          return
        }
        
        // Create or get existing conversation via API
        const response = await messagingService.createConversation(tutorId)
        
        // Check if it's an existing conversation or new one
        if (response.message === 'Using existing conversation') {
          // Use the conversation directly from the backend response
          const backendConversation = response.conversation
          
          // Determine the other participant
          const otherParticipant = backendConversation.participant1_id === currentUserId.value 
            ? backendConversation.participant2 
            : backendConversation.participant1
          
          // Map it to the frontend format
          const mappedConversation = {
            id: backendConversation.id,
            participant: {
              id: otherParticipant.id,
              name: `${otherParticipant.first_name} ${otherParticipant.last_name}`,
              type: otherParticipant.user_type
            },
            lastMessage: backendConversation.last_message_content || 'No messages yet',
            lastMessageAt: backendConversation.last_message_at || backendConversation.created_at,
            unreadCount: 0
          }
          
          await selectConversationWithRoom(mappedConversation)
          
        } else {
          // New conversation created, reload and select
          await loadConversations()
          
          // Find the newly created conversation
          const newConversation = conversations.value.find(conv => 
            conv.participant.id === tutorId
          )
          
          if (newConversation) {
            await selectConversationWithRoom(newConversation)
          }
        }
      } catch (error) {
        console.error('Error creating conversation:', error)
        alert('Failed to create conversation: ' + error.message)
      }
    }

    const attachFile = () => {
      // Handle file attachment
    }

    // Message context menu
    const showMessageContextMenu = (event, message) => {
      // Create context menu
      const contextMenu = document.createElement('div')
      contextMenu.className = 'context-menu'
      contextMenu.innerHTML = `
        <div class="context-menu-item" onclick="deleteMessage('${message.id}')">
          <i class="fas fa-trash"></i> Delete Message
        </div>
        <div class="context-menu-item" onclick="copyMessage('${message.content}')">
          <i class="fas fa-copy"></i> Copy Text
        </div>
      `
      
      // Position the menu
      contextMenu.style.position = 'fixed'
      contextMenu.style.left = event.clientX + 'px'
      contextMenu.style.top = event.clientY + 'px'
      contextMenu.style.zIndex = '9999'
      
      // Add to DOM
      document.body.appendChild(contextMenu)
      
      // Remove on click outside
      const removeMenu = () => {
        document.body.removeChild(contextMenu)
        document.removeEventListener('click', removeMenu)
      }
      
      setTimeout(() => {
        document.addEventListener('click', removeMenu)
      }, 100)
    }

    // Delete message function
    const deleteMessage = async (messageId) => {
      if (confirm('Are you sure you want to delete this message?')) {
        try {
          await messagingService.deleteMessage(messageId)
          // Remove from local state
          messages.value = messages.value.filter(msg => msg.id !== messageId)
        } catch (error) {
          console.error('Error deleting message:', error)
          alert('Failed to delete message')
        }
      }
    }

    // Copy message function
    const copyMessage = (content) => {
      navigator.clipboard.writeText(content).then(() => {
        // Show brief feedback
        const toast = document.createElement('div')
        toast.textContent = 'Message copied!'
        toast.className = 'copy-toast'
        document.body.appendChild(toast)
        setTimeout(() => document.body.removeChild(toast), 2000)
      })
    }

    // Make functions globally available for context menu
    window.deleteMessage = deleteMessage
    window.copyMessage = copyMessage

    // Set up Socket.io connection and message handling
    const setupMessaging = () => {
      if (authStore.session?.access_token) {
        // Connect to messaging service
        messagingService.connect(authStore.session.access_token)
        
        // Handle new messages
        messagingService.on('new_message', (message) => {
          // Only add message if it's for the current conversation
          if (selectedConversation.value && message.conversation_id === selectedConversation.value.id) {
            // Check if this is replacing a temporary message
            const tempMessageIndex = messages.value.findIndex(msg => 
              msg.id.startsWith('temp_') && 
              msg.senderId === message.sender_id && 
              msg.content === message.content
            )
            
          const newMessage = {
            id: message.id,
            senderId: message.sender_id,
            content: message.content,
            messageType: message.message_type,
            createdAt: message.created_at,
            readAt: message.read_at,
            deliveredAt: message.delivered_at,
            sender: message.sender ? {
              name: `${message.sender.first_name} ${message.sender.last_name}`,
              type: message.sender.user_type
            } : null
          }
            
            if (tempMessageIndex !== -1) {
              // Replace temporary message with real one
              messages.value[tempMessageIndex] = newMessage
            } else {
              // Add new message
              messages.value.push(newMessage)
            }
          }
          
          // Update conversation in list instead of full reload
          const conversationIndex = conversations.value.findIndex(conv => 
            conv.id === message.conversation_id
          )
          if (conversationIndex !== -1) {
            conversations.value[conversationIndex].lastMessage = message.content
            conversations.value[conversationIndex].lastMessageAt = message.created_at
          }
        })

        // Handle reconnection - rejoin conversation room if one is selected
        messagingService.on('connect', () => {
          if (selectedConversation.value) {
            messagingService.joinConversation(selectedConversation.value.id)
          }
        })
        
        // Handle typing indicators
        messagingService.on('user_typing', (data) => {
          // TODO: Implement typing indicator UI
        })
        
        // Handle message errors
        messagingService.on('message_error', (error) => {
          console.error('Message error:', error)
          alert(`Failed to send message: ${error.error || 'Unknown error'}`)
        })
      }
    }

    // Join conversation room when conversation is selected
    const joinConversationRoom = (conversationId) => {
      if (conversationId) {
        messagingService.joinConversation(conversationId)
      }
    }

    // Update selectConversation to join room
    const selectConversationWithRoom = async (conversation) => {
      selectedConversation.value = conversation
      
      if (conversation?.id) {
        joinConversationRoom(conversation.id)
        await loadMessages(conversation.id)
      }
    }

    onMounted(async () => {
      // Initialize auth store first
      await authStore.initializeAuth()
      
      // Wait a moment for auth to be ready
      await new Promise(resolve => setTimeout(resolve, 100))
      
      loadConversations()
      setupMessaging()
    })

    onUnmounted(() => {
      // Clean up event listeners
      messagingService.off('new_message')
      messagingService.off('user_typing')
      messagingService.off('message_error')
      messagingService.off('connect')
      
      // Clean up Socket.io connection
      messagingService.disconnect()
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
      selectConversation: selectConversationWithRoom,
      sendMessage,
      startNewConversation,
      attachFile,
      availableTutors,
      showTutorSelection,
      selectedTutorId,
      createConversationWithTutor
    }
  }
}
</script>

<style scoped>
/* Cyberpunk Messages Page */
.messages-page {
  background: #1a1a1a !important;
  min-height: 100vh;
  color: var(--cyber-text, #ffffff);
}

/* Cards */
.card {
  background: rgba(26, 26, 26, 0.85) !important;
  border: 2px solid var(--cyber-grey-light, #4a4a4a) !important;
  border-radius: 15px;
  box-shadow:
    0 0 15px rgba(255, 140, 66, 0.1),
    0 0 30px rgba(255, 140, 66, 0.05) !important;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  color: var(--cyber-text, #ffffff) !important;
}

.card:hover {
  border-color: var(--cyber-orange, #ff8c42) !important;
  box-shadow: 0 0 25px rgba(255, 140, 66, 0.3) !important;
}

.card-header {
  background: rgba(255, 140, 66, 0.1) !important;
  border-bottom: 1px solid var(--cyber-orange, #ff8c42) !important;
  color: var(--cyber-text, #ffffff) !important;
}

.card-body {
  color: var(--cyber-text, #ffffff) !important;
}

/* Headings and Text */
h5, h6 {
  color: var(--cyber-text, #ffffff) !important;
  text-shadow: 0 0 5px rgba(255, 140, 66, 0.3);
}

.text-muted {
  color: var(--cyber-text-muted, #cccccc) !important;
}

.fw-bold {
  color: var(--cyber-text, #ffffff) !important;
}

/* Conversation Items */
.conversations-list {
  max-height: 500px;
  overflow-y: auto;
}

.conversation-item {
  transition: all 0.3s ease;
  cursor: pointer;
  border-bottom: 1px solid var(--cyber-grey-light, #4a4a4a) !important;
}

.conversation-item:hover {
  background: rgba(255, 140, 66, 0.1) !important;
}

.conversation-item.active {
  background: linear-gradient(90deg, rgba(255, 140, 66, 0.2), rgba(255, 210, 63, 0.1)) !important;
  border-left: 3px solid var(--cyber-orange, #ff8c42);
}

.conversation-item.active .text-muted {
  color: var(--cyber-text-muted, #cccccc) !important;
}

/* Avatars */
.conversation-avatar,
.chat-avatar {
  background: rgba(255, 140, 66, 0.2) !important;
  border: 2px solid var(--cyber-orange, #ff8c42);
  transition: all 0.3s ease;
}

.conversation-avatar i,
.chat-avatar i {
  color: var(--cyber-orange, #ff8c42) !important;
}

.conversation-item:hover .conversation-avatar {
  transform: scale(1.1);
  background: linear-gradient(45deg, var(--cyber-orange, #ff8c42), var(--cyber-yellow, #ffd23f)) !important;
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.5);
}

.conversation-item:hover .conversation-avatar i {
  color: white !important;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

/* Messages Container */
.messages-container {
  background: rgba(42, 42, 42, 0.5) !important;
  backdrop-filter: blur(5px);
}

.messages-container::-webkit-scrollbar {
  width: 8px;
}

.messages-container::-webkit-scrollbar-track {
  background: rgba(74, 74, 74, 0.3);
  border-radius: 4px;
}

.messages-container::-webkit-scrollbar-thumb {
  background: var(--cyber-orange, #ff8c42);
  border-radius: 4px;
}

/* Message Bubbles */
.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  cursor: context-menu;
}

.message-bubble.sent {
  background: linear-gradient(135deg, var(--cyber-orange, #ff8c42), var(--cyber-yellow, #ffd23f));
  color: white;
  margin-left: auto;
  border: 1px solid var(--cyber-orange, #ff8c42);
}

.message-bubble.received {
  background: rgba(42, 42, 42, 0.8);
  color: var(--cyber-text, #ffffff);
  border: 1px solid var(--cyber-grey-light, #4a4a4a);
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
}

.message-status {
  font-size: 0.75rem;
  margin-left: 8px;
}

.status-sent {
  color: rgba(255, 255, 255, 0.7);
}

.status-delivered {
  color: rgba(255, 255, 255, 0.8);
}

.status-read {
  color: #4CAF50;
}

/* Message Input */
.message-input {
  background: rgba(26, 26, 26, 0.9) !important;
  border-top: 1px solid var(--cyber-orange, #ff8c42) !important;
}

/* Form Controls */
.form-control {
  background: rgba(42, 42, 42, 0.8) !important;
  border: 2px solid var(--cyber-grey-light, #4a4a4a) !important;
  color: var(--cyber-text, #ffffff) !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.form-control:focus {
  background: rgba(42, 42, 42, 0.95) !important;
  border-color: var(--cyber-orange, #ff8c42) !important;
  box-shadow: 0 0 15px rgba(255, 140, 66, 0.3) !important;
  color: var(--cyber-text, #ffffff) !important;
}

.form-control::placeholder {
  color: var(--cyber-text-dim, #888888) !important;
}

.input-group-text {
  background: rgba(42, 42, 42, 0.8) !important;
  border: 2px solid var(--cyber-grey-light, #4a4a4a) !important;
  color: var(--cyber-text, #ffffff) !important;
}

/* Buttons */
.btn-primary {
  background: linear-gradient(45deg, var(--cyber-orange, #ff8c42), var(--cyber-yellow, #ffd23f)) !important;
  border: 2px solid var(--cyber-orange, #ff8c42) !important;
  color: white !important;
  font-weight: 600;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(255, 140, 66, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 30px rgba(255, 140, 66, 0.5) !important;
}

.btn-primary:disabled {
  opacity: 0.7;
  transform: none;
  cursor: not-allowed;
}

.btn-outline-secondary {
  background: transparent !important;
  border: 2px solid var(--cyber-grey-light, #4a4a4a) !important;
  color: var(--cyber-text, #ffffff) !important;
  transition: all 0.3s ease;
  border-radius: 10px;
  font-weight: 600;
}

.btn-outline-secondary:hover {
  background: rgba(74, 74, 74, 0.3) !important;
  border-color: var(--cyber-orange, #ff8c42) !important;
  color: var(--cyber-orange, #ff8c42) !important;
  transform: translateY(-2px);
}

/* Badge */
.badge {
  border: 1px solid var(--cyber-orange, #ff8c42);
  font-weight: 600;
  padding: 0.4em 0.7em;
  border-radius: 6px;
}

.badge.bg-primary {
  background: linear-gradient(45deg, var(--cyber-orange, #ff8c42), var(--cyber-yellow, #ffd23f)) !important;
  color: white !important;
  border-color: var(--cyber-orange, #ff8c42) !important;
  box-shadow: 0 0 10px rgba(255, 140, 66, 0.5);
}

/* Icons */
i.text-primary {
  color: var(--cyber-orange, #ff8c42) !important;
}

/* Border */
.border-bottom {
  border-color: var(--cyber-grey-light, #4a4a4a) !important;
}

.border-top {
  border-color: var(--cyber-orange, #ff8c42) !important;
}

/* Background Elements */
.bg-white {
  background: rgba(26, 26, 26, 0.5) !important;
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Context Menu */
.context-menu {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 4px 0;
  min-width: 150px;
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #333;
}

.context-menu-item:hover {
  background: #f5f5f5;
}

.context-menu-item i {
  width: 16px;
  text-align: center;
}

/* Copy Toast */
.copy-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  z-index: 10000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsive */
@media (max-width: 768px) {
  .messages-container {
    height: 400px !important;
  }

  .message-bubble {
    max-width: 85%;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.no-tutors {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}

.tutor-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tutor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tutor-item:hover {
  border-color: #007bff;
  background-color: #f8f9fa;
}

.tutor-info h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 16px;
}

.tutor-info p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.tutor-actions .btn {
  padding: 8px 16px;
  font-size: 14px;
}
</style>
