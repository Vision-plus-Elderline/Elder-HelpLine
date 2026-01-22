import React, { useState, useEffect } from 'react';
import { Heart, Phone, Users, Clock, Mail, MapPin, ExternalLink, ShieldCheck, BarChart3, User, IdCard } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function EnhancedFooter() {
  const [totalPageViews, setTotalPageViews] = useState<number | string>('...');
  const [totalVisitors, setTotalVisitors] = useState<number | string>('...');
  const [activeVisitors, setActiveVisitors] = useState<number | string>('...');
  const [timeUpdated, setTimeUpdated] = useState<number | string>('...');
  const pageLink = {
    home: '/',
    about: '/about',
    contact: '/contact',
    privacy: '/privacy',
    terms: '/terms',
  }
  const [nameDetail, setNameDetail] = useState<string>('');
  const [idDetail, setIdDetail] = useState<string>('');
  const user = useAuth();
  useEffect(() => {
    setNameDetail(user?.user?.user_metadata?.full_name || '');
    setIdDetail(user?.user?.user_metadata?.emp_id || '');
    // console.log(nameDetail, idDetail);
  }, [user])
  // console.log(user?.user?.user_metadata?.full_name);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      ws = new WebSocket('wss://chelqujdhnjboeeamxtu.supabase.co/functions/v1/public-analytics?share_token=5fa72a22c2b0434f');

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.data?.generated_at) {
            setTimeUpdated(new Date(message.data.generated_at).toLocaleDateString());
          }

          if (message.type === 'initial' || message.type === 'metrics_update') {
            const metrics = message.data?.metrics;
            if (metrics) {
              if (metrics.total_page_views !== undefined) setTotalPageViews(metrics.total_page_views);
              if (metrics.total_visitors !== undefined) setTotalVisitors(metrics.total_visitors);
              if (metrics.active_page_views !== undefined) setActiveVisitors(metrics.active_page_views);
              if (metrics.generated_at !== undefined) setTimeUpdated(new Date(metrics.generated_at).toLocaleString());
            }
          }
        } catch (err) {
          // Silent error
        }
      };

      ws.onclose = () => {
        reconnectTimeout = setTimeout(connect, 5000); // Reconnect after 5 seconds
      };

      ws.onerror = () => {
        if (ws) ws.close();
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.onclose = null; // Prevent reconnection on unmount
        ws.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Top Section - Highlight Banner */}
        <div className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 backdrop-blur-sm border border-teal-500/20 rounded-2xl p-6 mb-12 shadow-lg">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-teal-500 rounded-full blur-xl animate-pulse opacity-30"></div>
                <Heart className="relative w-8 h-8 text-teal-600 fill-teal-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Supporting Senior Citizens</h3>
                <p className="text-sm text-gray-600">Caring for India's elderly with dignity and respect</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-4 rounded-xl border border-teal-200 shadow-lg hover:shadow-xl hover:bg-white transition-all">
              <Phone className="w-6 h-6 text-teal-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">14567</div>
                <div className="text-xs text-gray-600">Toll-Free • 24×7 Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <img
              src="/logo/VPSC.png"
              alt="Vision Plus Integrated Services"
              className="h-14 w-auto object-contain mb-6 drop-shadow-lg"
            />
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              A pioneering initiative supporting senior citizens across India with compassionate care and modern solutions.
            </p>
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0 text-teal-600" />
              <span>Centrally Sponsored Scheme Initiative</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { name: 'Home', href: pageLink.home },
                { name: 'About Us', href: "/about" },
                { name: 'Our Presence', href: "/presence" },

                { name: 'Grievance', href: "/grievance" },
                { name: 'Feedback', href: "/feedback" },
                { name: 'Contact', href: "/contact" },
                // { name: 'Privacy Policy', href: pageLink.privacy },
                // { name: 'Terms & Conditions', href: pageLink.terms },
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-gray-600 hover:text-teal-600 hover:translate-x-1 transition-all inline-flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full group-hover:w-2 transition-all"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Get in Touch</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Phone className="w-4 h-4 mt-0.5 text-teal-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-gray-900">14567</div>
                  <div className="text-xs text-gray-500">24×7 Helpline</div>
                </div>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 mt-0.5 text-teal-600 flex-shrink-0" />
                <div>
                  <div>support@elderline.in</div>
                  <div className="text-xs text-gray-500">Email Support</div>
                </div>

              </div>
              {user?.user && (
                <div className="flex flex-col items-start gap-2 mt-10 pt-3 ">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4 mt-0.5 text-teal-600 flex-shrink-0" />
                    <p className="text-xs">Name</p>
                    <p className="text-xs text-gray-600">{nameDetail}</p>
                  </div>
                  <div className="flex items-center gap-1 ">
                    <IdCard className="w-4 h-4  text-teal-600 flex-shrink-0" />
                    <p className="text-xs">ID Number</p>
                    <p className="text-xs text-gray-600">{idDetail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-gray-900">Connect With Us</h4>
            <p className="text-sm text-gray-600 mb-4">Stay updated with our latest initiatives</p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Facebook', href: 'https://facebook.com/14567ElderLine', icon: 'M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z' },
                { name: 'Twitter', href: 'https://twitter.com/14567ElderLine', icon: 'M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.22-1.95-.55v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.94.07 4.28 4.28 0 0 0 4 2.98 8.52 8.52 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21c7.34 0 11.35-6.08 11.35-11.35 0-.17 0-.34-.01-.51.78-.57 1.45-1.28 1.98-2.08z' },
                { name: 'LinkedIn', href: 'https://linkedin.com/company/14567elderline', icon: 'M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z' },
                { name: 'YouTube', href: 'https://youtube.com/@14567ElderLine', icon: 'M23 12s0-3.85-.77-5.58c-.43-.98-1.69-1.75-2.67-1.96C17.32 4 12 4 12 4s-5.32 0-7.56.46c-.98.21-2.24.98-2.67 1.96C1 8.15 1 12 1 12s0 3.85.77 5.58c.43.98 1.69 1.75 2.67 1.96C6.68 20 12 20 12 20s5.32 0 7.56-.46c.98-.21 2.24-.98 2.67-1.96C23 15.85 23 12 23 12zm-13 4v-8l6 4-6 4z' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="group relative w-11 h-11 rounded-xl bg-white hover:bg-teal-50 border border-gray-200 hover:border-teal-300 flex items-center justify-center transition-all hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 text-gray-600 group-hover:text-teal-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-500/0 to-emerald-500/0 group-hover:from-teal-500/10 group-hover:to-emerald-500/10 transition-all"></div>
                </a>
              ))}
            </div>
            <div className="flex items-center mt-5 gap-2 text-sm text-gray-600 group">
              <span className="font-semibold text-gray-600 cursor-pointer group-hover:text-teal-600 transition-colors" onClick={() => window.open(pageLink.privacy, '_blank')}>Privacy Policy</span>
              <span className="text-gray-500">|</span>
              <span className="font-semibold text-gray-600 cursor-pointer group-hover:text-teal-600 transition-colors">Terms & Conditions</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Elder Line is a registered trademark of Telecommunications Consultants India Limited.
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-semibold text-gray-900">Copyright © 2026.</span> All rights reserved.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed max-w-2xl">
              Telecommunications Consultants India Limited <br />
              (A Public Sector Undertaking of Government of India)<br />
              Department of Telecommunication, Ministry of Communication<br />
              Designed, developed & hosted by Vision Plus Integrated Services Pvt. Ltd.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </div>
              <span className="text-gray-600">Active Now:</span>
              <span className="font-bold text-gray-900">{totalVisitors}65</span>
            </div>
            {/* <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">Total Visitors:</span>
              <span className="font-bold text-gray-900">{totalVisitors}</span>
            </div> */}
            <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span className="text-gray-600">Total Views:</span>
              <span className="font-bold text-gray-900">{totalPageViews}247</span>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-gray-600">Updated:</span>
              <span className="font-bold text-gray-900">{timeUpdated}</span>
            </div>
          </div>
        </div>

        {/* Signature */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-md backdrop-blur-sm">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-teal-600 fill-teal-600 animate-pulse" />
            <span>by <span className="font-semibold text-gray-900">Abhishek John Charan</span></span>
          </div>
        </div>
      </div>
    </footer>
  );
}