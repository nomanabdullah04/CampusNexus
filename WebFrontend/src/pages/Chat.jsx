import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';
import { Send, ArrowLeft, User, MessageSquare } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const messagesEndRef = useRef(null);

  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const targetSellerId = searchParams.get('sellerId');
  const targetSellerName = searchParams.get('sellerName');
  const targetSellerEmail = searchParams.get('sellerEmail');

  useEffect(() => {
    if (!user) {
      navigate('/sign-in');
      return;
    }
    initializeChat();
  }, [user]);

  // Scroll to bottom when messages list changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Polling for new messages in active thread
  useEffect(() => {
    if (!activeContact) return;

    fetchMessages(activeContact.id);

    const interval = setInterval(() => {
      fetchMessagesSilently(activeContact.id);
    }, 3000);

    return () => clearInterval(interval);
  }, [activeContact]);

  const initializeChat = async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch existing contacts
      const res = await privateAPI.get('/message/contacts');
      let currentContacts = [];
      if (res.data.success) {
        currentContacts = res.data.data;
      }

      // 2. Handle target seller from query parameters
      if (targetSellerId) {
        const sellerIdNum = Number(targetSellerId);
        const exists = currentContacts.some(c => c.id === sellerIdNum);
        
        if (!exists && sellerIdNum !== user.id) {
          // Add temporary contact to the list
          const tempContact = {
            id: sellerIdNum,
            name: targetSellerName ? decodeURIComponent(targetSellerName) : 'Seller',
            email: targetSellerEmail ? decodeURIComponent(targetSellerEmail) : '',
            picture: null
          };
          currentContacts = [tempContact, ...currentContacts];
        }

        const active = currentContacts.find(c => c.id === sellerIdNum);
        if (active) setActiveContact(active);
      } else if (currentContacts.length > 0) {
        setActiveContact(currentContacts[0]);
      }

      setContacts(currentContacts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const res = await privateAPI.get(`/message/thread?otherUserId=${otherUserId}`);
      if (res.data.success) {
        setMessages(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load thread messages', err);
    }
  };

  const fetchMessagesSilently = async (otherUserId) => {
    try {
      const res = await privateAPI.get(`/message/thread?otherUserId=${otherUserId}`);
      if (res.data.success) {
        const newMsgs = res.data.data;
        // Update if count changed OR if the latest message ID differs (handles edits/deletions)
        const lastOld = messages[messages.length - 1];
        const lastNew = newMsgs[newMsgs.length - 1];
        if (newMsgs.length !== messages.length || lastOld?.id !== lastNew?.id) {
          setMessages(newMsgs);
        }
      }
    } catch (err) {}
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const textToSend = inputText.trim();
    setInputText('');

    try {
      const res = await privateAPI.post('/message/send', {
        receiverId: activeContact.id,
        content: textToSend
      });
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.data]);
        
        // Move contact to top of sidebar if not already
        setContacts(prev => {
          const filtered = prev.filter(c => c.id !== activeContact.id);
          return [activeContact, ...filtered];
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send message');
    }
  };

  if (loading) {
    return (
      <div className="spinner-container" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <div className="spinner" />
        <p className="text-slate">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="page-layout" style={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ background: 'var(--color-forest)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem' }}>Campus Messages</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.8125rem' }}>Chat with buyers and sellers</p>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', background: '#F8FAFC' }}>
        {/* Sidebar / Contacts List */}
        <div style={{ width: '300px', borderRight: '1px solid var(--color-ash)', display: 'flex', flexDirection: 'column', background: 'white' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-ash)', fontWeight: 600, color: 'var(--color-forest)' }}>
            Active Chats
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {contacts.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-slate)', fontSize: '0.875rem' }}>
                <MessageSquare size={32} color="var(--color-ash)" style={{ marginBottom: '0.5rem' }} />
                <p style={{ margin: 0 }}>No conversations yet.</p>
              </div>
            ) : (
              contacts.map(contact => (
                <div
                  key={contact.id}
                  onClick={() => setActiveContact(contact)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem 1rem',
                    borderBottom: '1px solid var(--color-ash)',
                    cursor: 'pointer',
                    background: activeContact?.id === contact.id ? '#F1F5F9' : 'transparent',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = activeContact?.id === contact.id ? '#F1F5F9' : '#F8FAFC'}
                  onMouseLeave={e => e.currentTarget.style.background = activeContact?.id === contact.id ? '#F1F5F9' : 'transparent'}
                >
                  <div className="avatar" style={{ width: '40px', height: '40px', fontSize: '0.9rem' }}>
                    {contact.name?.[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-forest)', margin: 0, fontSize: '0.875rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {contact.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--color-slate)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {contact.email}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Feed */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          {activeContact ? (
            <>
              {/* Active Header */}
              <div style={{ padding: '0.875rem 1.5rem', background: 'white', borderBottom: '1px solid var(--color-ash)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div className="avatar" style={{ width: '36px', height: '36px', fontSize: '0.85rem' }}>
                  {activeContact.name?.[0]?.toUpperCase()}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--color-forest)', fontSize: '0.9375rem', fontWeight: 700 }}>
                    {activeContact.name}
                  </h4>
                  <p style={{ margin: 0, color: 'var(--color-slate)', fontSize: '0.75rem' }}>
                    {activeContact.email}
                  </p>
                </div>
              </div>

              {/* Messages Feed */}
              <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.length === 0 ? (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate)', fontSize: '0.875rem' }}>
                    Send a message to start the conversation!
                  </div>
                ) : (
                  messages.map(msg => {
                    const isMe = msg.senderId === user.id;
                    return (
                      <div
                        key={msg.id}
                        style={{
                          display: 'flex',
                          justifyContent: isMe ? 'flex-end' : 'flex-start',
                          width: '100%'
                        }}
                      >
                        <div
                          style={{
                            maxWidth: '70%',
                            background: isMe ? 'var(--color-forest)' : 'white',
                            color: isMe ? 'white' : 'var(--color-forest)',
                            padding: '0.625rem 1rem',
                            borderRadius: '16px',
                            borderTopRightRadius: isMe ? '4px' : '16px',
                            borderTopLeftRadius: isMe ? '16px' : '4px',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                            fontSize: '0.875rem',
                            lineHeight: 1.5,
                            wordBreak: 'break-word',
                            border: isMe ? 'none' : '1px solid var(--color-ash)'
                          }}
                        >
                          {msg.content}
                          <div
                            style={{
                              fontSize: '0.65rem',
                              textAlign: 'right',
                              color: isMe ? 'rgba(255,255,255,0.7)' : 'var(--color-slate)',
                              marginTop: '0.25rem'
                            }}
                          >
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSend} style={{ padding: '1rem 1.5rem', background: 'white', borderTop: '1px solid var(--color-ash)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Type your message here..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  style={{ flex: 1, margin: 0, borderRadius: '24px', paddingLeft: '1.25rem' }}
                />
                <button
                  type="submit"
                  className="btn btn-sage"
                  style={{
                    borderRadius: '50%',
                    width: '42px',
                    height: '42px',
                    minWidth: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0
                  }}
                  disabled={!inputText.trim()}
                >
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--color-slate)' }}>
              <MessageSquare size={48} color="var(--color-ash)" style={{ marginBottom: '1rem' }} />
              <p style={{ margin: 0 }}>Select a chat or contact a seller to start messaging.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
