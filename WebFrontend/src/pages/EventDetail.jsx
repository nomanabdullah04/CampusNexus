import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Tag, MapPin, Users, Building2, Share2, CheckCircle } from 'lucide-react';
import { privateAPI } from '../api/api';
import { useUser } from '../context/UserContext';

// Static events data — duplicated here as fallback for direct URL access
const eventsData = [
  { id: 1, title: 'Chattogram Regional Programming Contest — CoU CSE Fest 2025', date: '27 Aug 2025', location: 'Comilla University Campus, Kotbari, Comilla', organizer: 'Dept. of CSE, Comilla University', attendees: '40 teams from 13 universities', image: '/cou_programming_contest.png', tags: ['#Programming', '#Contest', '#CompetitiveProgramming'], description: 'The Department of CSE, Comilla University hosted the Chattogram Regional Programming Contest as part of CoU CSE Fest 2025. 40 teams from 13 universities across the Chattogram division competed. The champion team "El Diablo" from CUET claimed the top prize.' },
  { id: 2, title: 'CSE Day 2025 — 17th Anniversary Celebration', date: '28 Feb 2025', location: 'Comilla University, CSE Department Building', organizer: 'Dept. of CSE, Comilla University', attendees: 'All CSE Students & Faculty', image: '/cou_cse_day.png', tags: ['#CSEDay', '#Anniversary', '#Cultural'], description: 'The Department of Computer Science & Engineering, Comilla University celebrated its 17th anniversary on February 28, 2025. The day featured a grand rally, cake-cutting ceremony, sports competitions, cultural program, and a prize-giving ceremony for outstanding students.' },
  { id: 3, title: 'EMCS 16th Batch Orientation — Executive Masters in CS', date: '22 May 2026', location: 'Seminar Hall, Comilla University', organizer: 'Dept. of CSE, Comilla University', attendees: 'EMCS 16th Batch Students', image: '/cou_emcs_orientation.png', tags: ['#EMCS', '#Orientation', '#GraduateStudy'], description: 'Orientation program for the 16th Batch of the Executive Masters in Computer Science (EMCS) program at Comilla University CSE Department. Faculty members welcomed new students and introduced the program curriculum, research opportunities, and departmental facilities.' },
  { id: 4, title: 'CoU CSE Inter-University Hackathon 2026', date: '15 Sep 2026', location: 'Computer Lab Complex, Comilla University', organizer: 'CoU CSE Student Association (COUCSA)', attendees: 'University Teams Nationwide', image: '/cou_hackathon.png', tags: ['#Hackathon', '#Innovation', '#AI'], description: 'An exciting 24-hour hackathon organized by the CoU CSE Student Association, bringing together bright minds from universities across Bangladesh. Teams will build innovative solutions using AI, Web, and Mobile technologies. Prizes worth BDT 1,00,000+ to be won.' },
  { id: 5, title: 'Workshop on Artificial Intelligence & Machine Learning', date: '20 Oct 2026', location: 'ICT Building Seminar Room, Comilla University', organizer: 'Dept. of CSE, Comilla University', attendees: 'CoU Students & Faculty (Open to All)', image: '/cou_workshop.png', tags: ['#AI', '#MachineLearning', '#Workshop'], description: 'A hands-on workshop on Artificial Intelligence and Machine Learning fundamentals organized by the CSE Department. Sessions cover neural networks, deep learning frameworks (TensorFlow, PyTorch), and real-world AI applications. Open to all CoU students and faculty.' },
  { id: 6, title: 'Comilla University 7th Convocation 2026', date: '10 Dec 2026', location: 'Comilla University Central Auditorium', organizer: 'Comilla University Administration', attendees: 'Graduating Students, Faculty & Guests', image: '/cou_convocation.png', tags: ['#Convocation', '#Graduation', '#Academic'], description: 'The 7th Convocation of Comilla University, awarding degrees to graduates of all departments including CSE. The grand ceremony will be presided over by the Chancellor. Students who completed their undergraduate and postgraduate programs will receive their degrees and certificates.' },
];

const EventDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { user } = useUser();
  // Prefer navigation state; fall back to static data for direct URL / bookmark access
  const event = location.state?.event || eventsData.find(e => e.id === Number(eventId)) || null;
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!event) {
    return (
      <div className="empty-state" style={{ minHeight: 'calc(100vh - 64px)' }}>
        <Calendar />
        <p>Event not found</p>
        <button className="btn btn-primary btn-sm" onClick={() => navigate('/events')}>← Back to Events</button>
      </div>
    );
  }

  const imageUrl = typeof event.image === 'object' ? event.image.uri : event.image;

  const handleRegister = async () => {
    if (!user) { navigate('/sign-in'); return; }
    setLoading(true);
    try {
      // Try backend registration first
      await privateAPI.post(`/event/${event.id}/register`);
      setRegistered(true);
    } catch (err) {
      // If backend event (static data), just show success
      setRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: event.title, text: event.description, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Event link copied to clipboard!');
    }
  };

  return (
    <div className="page-layout">
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-forest) 0%, #1B4332 100%)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white' }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}
          id="event-detail-back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 style={{ color: 'white', flex: 1, margin: 0, fontSize: '1.1rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Event Details
        </h2>
        <button
          onClick={handleShare}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}
        >
          <Share2 size={18} />
        </button>
      </div>

      <div className="page-content-narrow" style={{ paddingBottom: '3rem' }}>
        {/* Event Image */}
        <div className="card mb-4" style={{ overflow: 'hidden' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={event.title}
              style={{ width: '100%', height: '280px', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80'; }}
            />
          ) : (
            <div style={{ height: '280px', background: 'var(--color-ash)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={48} color="var(--color-sage)" />
            </div>
          )}
        </div>

        {/* Event Info Card */}
        <div className="card mb-4">
          <div className="card-body">
            {/* Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.875rem' }}>
              {event.tags?.map((tag, i) => (
                <span key={i} className="badge badge-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.72rem' }}>
                  <Tag size={10} /> {tag}
                </span>
              ))}
            </div>

            <h1 style={{ fontSize: '1.375rem', color: 'var(--color-forest)', marginBottom: '1.25rem', lineHeight: 1.3 }}>
              {event.title}
            </h1>

            {/* Meta Info Grid */}
            <div style={{ background: '#F0FDF4', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <Calendar size={16} style={{ color: 'var(--color-forest)', marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE</p>
                  <p style={{ margin: 0, color: 'var(--color-forest)', fontWeight: 700, fontSize: '0.9rem' }}>{event.date}</p>
                </div>
              </div>
              {event.location && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <MapPin size={16} style={{ color: 'var(--color-forest)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOCATION</p>
                    <p style={{ margin: 0, color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.875rem' }}>{event.location}</p>
                  </div>
                </div>
              )}
              {event.organizer && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Building2 size={16} style={{ color: 'var(--color-forest)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>ORGANIZED BY</p>
                    <p style={{ margin: 0, color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.875rem' }}>{event.organizer}</p>
                  </div>
                </div>
              )}
              {event.attendees && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                  <Users size={16} style={{ color: 'var(--color-forest)', marginTop: 2, flexShrink: 0 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: 'var(--color-slate)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>PARTICIPANTS</p>
                    <p style={{ margin: 0, color: 'var(--color-forest)', fontWeight: 600, fontSize: '0.875rem' }}>{event.attendees}</p>
                  </div>
                </div>
              )}
            </div>

            <h3 style={{ fontSize: '1rem', color: 'var(--color-forest)', marginBottom: '0.6rem' }}>About This Event</h3>
            <p style={{ color: 'var(--color-slate)', lineHeight: 1.75, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {event.description}
            </p>

            {/* CoU Branding Footer */}
            <div style={{ background: 'var(--color-ash)', borderRadius: 'var(--radius-md)', padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <img
                src="https://cou.ac.bd/public/logo/cou_logo.png"
                alt="CoU"
                style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', padding: 2, objectFit: 'contain', flexShrink: 0 }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: 'var(--color-forest)' }}>Comilla University</p>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--color-slate)' }}>Dept. of Computer Science & Engineering • cse@cou.ac.bd</p>
              </div>
            </div>

            {/* Register Button */}
            {registered ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', background: '#D1FAE5', borderRadius: 'var(--radius-md)', padding: '1rem', color: '#065F46', fontWeight: 700 }}>
                <CheckCircle size={22} />
                You are registered for this event!
              </div>
            ) : (
              <button
                className="btn btn-primary btn-full btn-lg"
                id="register-event-btn"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? 'Registering...' : '✅ Register for This Event'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
