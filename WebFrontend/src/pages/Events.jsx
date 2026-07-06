import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Tag, MapPin, Users } from 'lucide-react';

const eventsData = [
  {
    id: 1,
    title: 'Chattogram Regional Programming Contest — CoU CSE Fest 2025',
    date: '27 Aug 2025',
    location: 'Comilla University Campus, Kotbari, Comilla',
    organizer: 'Dept. of CSE, Comilla University',
    attendees: '40 teams from 13 universities',
    image: '/cou_programming_contest.png',
    tags: ['#Programming', '#Contest', '#CompetitiveProgramming'],
    description:
      'The Department of CSE, Comilla University hosted the Chattogram Regional Programming Contest as part of CoU CSE Fest 2025. 40 teams from 13 universities across the Chattogram division competed. The champion team "El Diablo" from CUET claimed the top prize.',
  },
  {
    id: 2,
    title: 'CSE Day 2025 — 17th Anniversary Celebration',
    date: '28 Feb 2025',
    location: 'Comilla University, CSE Department Building',
    organizer: 'Dept. of CSE, Comilla University',
    attendees: 'All CSE Students & Faculty',
    image: '/cou_cse_day.png',
    tags: ['#CSEDay', '#Anniversary', '#Cultural'],
    description:
      'The Department of Computer Science & Engineering, Comilla University celebrated its 17th anniversary on February 28, 2025. The day featured a grand rally, cake-cutting ceremony, sports competitions, cultural program, and a prize-giving ceremony for outstanding students.',
  },
  {
    id: 3,
    title: 'EMCS 16th Batch Orientation — Executive Masters in CS',
    date: '22 May 2026',
    location: 'Seminar Hall, Comilla University',
    organizer: 'Dept. of CSE, Comilla University',
    attendees: 'EMCS 16th Batch Students',
    image: '/cou_emcs_orientation.png',
    tags: ['#EMCS', '#Orientation', '#GraduateStudy'],
    description:
      'Orientation program for the 16th Batch of the Executive Masters in Computer Science (EMCS) program at Comilla University CSE Department. Faculty members welcomed new students and introduced the program curriculum, research opportunities, and departmental facilities.',
  },
  {
    id: 4,
    title: 'CoU CSE Inter-University Hackathon 2026',
    date: '15 Sep 2026',
    location: 'Computer Lab Complex, Comilla University',
    organizer: 'CoU CSE Student Association (COUCSA)',
    attendees: 'University Teams Nationwide',
    image: '/cou_hackathon.png',
    tags: ['#Hackathon', '#Innovation', '#AI'],
    description:
      'An exciting 24-hour hackathon organized by the CoU CSE Student Association, bringing together bright minds from universities across Bangladesh. Teams will build innovative solutions using AI, Web, and Mobile technologies. Prizes worth BDT 1,00,000+ to be won.',
  },
  {
    id: 5,
    title: 'Workshop on Artificial Intelligence & Machine Learning',
    date: '20 Oct 2026',
    location: 'ICT Building Seminar Room, Comilla University',
    organizer: 'Dept. of CSE, Comilla University',
    attendees: 'CoU Students & Faculty (Open to All)',
    image: '/cou_workshop.png',
    tags: ['#AI', '#MachineLearning', '#Workshop'],
    description:
      'A hands-on workshop on Artificial Intelligence and Machine Learning fundamentals organized by the CSE Department. Sessions cover neural networks, deep learning frameworks (TensorFlow, PyTorch), and real-world AI applications. Open to all CoU students and faculty.',
  },
  {
    id: 6,
    title: 'Comilla University 7th Convocation 2026',
    date: '10 Dec 2026',
    location: 'Comilla University Central Auditorium',
    organizer: 'Comilla University Administration',
    attendees: 'Graduating Students, Faculty & Guests',
    image: '/cou_convocation.png',
    tags: ['#Convocation', '#Graduation', '#Academic'],
    description:
      'The 7th Convocation of Comilla University, awarding degrees to graduates of all departments including CSE. The grand ceremony will be presided over by the Chancellor. Students who completed their undergraduate and postgraduate programs will receive their degrees and certificates.',
  },
];

const CATEGORY_TAGS = ['All', '#Programming', '#Contest', '#CSEDay', '#EMCS', '#Hackathon', '#AI', '#Workshop', '#Convocation', '#Graduation'];

const Events = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = eventsData.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === 'All' || e.tags.includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div className="page-layout">
      {/* Header */}
      <div className="page-header" style={{ background: 'linear-gradient(135deg, var(--color-forest) 0%, #1B4332 100%)', padding: '0.75rem 1.5rem', minHeight: 0 }}>
      </div>

      {/* Search + Filter Bar */}
      <div style={{ background: 'white', padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-ash)', position: 'sticky', top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <div className="search-bar" style={{ marginBottom: '0.75rem' }}>
            <Search size={20} />
            <input
              placeholder="Search events by name, tag or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="events-search"
            />
          </div>
          {/* Tag filter pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {CATEGORY_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  border: '1px solid',
                  borderColor: activeTag === tag ? 'var(--color-forest)' : 'var(--color-ash)',
                  background: activeTag === tag ? 'var(--color-forest)' : 'transparent',
                  color: activeTag === tag ? 'white' : 'var(--color-slate)',
                  borderRadius: 999,
                  padding: '0.25rem 0.75rem',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  fontWeight: activeTag === tag ? 700 : 400,
                  transition: 'all 0.15s',
                }}
                id={`filter-${tag.replace('#', '')}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="page-content">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Calendar />
            <p>No events found. Try a different search.</p>
          </div>
        ) : (
          <div className="product-card-grid">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="card fade-in"
                style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = ''; }}
                onClick={() => navigate(`/events/${event.id}`, { state: { event } })}
              >
                {/* Event Image */}
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={event.image}
                    alt={event.title}
                    className="card-img"
                    style={{ height: 200, objectFit: 'cover', width: '100%' }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&q=80'; }}
                  />
                  {/* Date badge overlay */}
                  <div style={{
                    position: 'absolute', top: 10, left: 10,
                    background: 'var(--color-forest)', color: 'white',
                    borderRadius: 'var(--radius-md)', padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem', fontWeight: 700,
                    display: 'flex', alignItems: 'center', gap: '0.3rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}>
                    <Calendar size={12} /> {event.date}
                  </div>
                </div>

                <div className="card-body">
                  <h3 style={{ color: 'var(--color-forest)', marginBottom: '0.5rem', fontSize: '0.95rem', lineHeight: 1.4 }}>
                    {event.title}
                  </h3>

                  {/* Location & Organizer */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.35rem', color: 'var(--color-slate)', fontSize: '0.78rem' }}>
                      <MapPin size={13} style={{ marginTop: 2, flexShrink: 0, color: 'var(--color-sage)' }} />
                      <span>{event.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-slate)', fontSize: '0.78rem' }}>
                      <Users size={13} style={{ flexShrink: 0, color: 'var(--color-sage)' }} />
                      <span>{event.attendees}</span>
                    </div>
                  </div>

                  <p style={{ color: 'var(--color-slate)', fontSize: '0.8rem', marginBottom: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {event.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
                    {event.tags.map((tag, i) => (
                      <span key={i} className="badge badge-mint" style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}>
                        <Tag size={9} /> {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className="btn btn-primary btn-full"
                    style={{ padding: '0.6rem 1rem', fontSize: '0.875rem' }}
                    onClick={(ev) => { ev.stopPropagation(); navigate(`/events/${event.id}`, { state: { event } }); }}
                    id={`view-event-${event.id}`}
                  >
                    View Event Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
