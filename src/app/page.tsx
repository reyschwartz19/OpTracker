import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Briefcase, Calendar, FileText, Bell, CheckCircle2, ArrowRight } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#1E3A8A]">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading text-lg font-semibold text-[#0F172A]">
                OpTracker
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0F172A] mb-6">
            Track Your Path to{' '}
            <span className="text-[#1E3A8A]">Success</span>
          </h1>
          <p className="text-lg sm:text-xl text-[#64748B] mb-8 max-w-2xl mx-auto">
            Manage scholarships, internships, and opportunities in one place.
            Never miss a deadline. Stay organized. Achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Tracking Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                I Have an Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#0F172A] mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Built for students and early career seekers who want to stay organized
              and never miss an opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Briefcase,
                title: 'Opportunity Tracking',
                description: 'Save and organize scholarships, internships, and jobs with full details.',
              },
              {
                icon: Calendar,
                title: 'Deadline Calendar',
                description: 'Visual calendar view of all your deadlines. Export to iCal.',
              },
              {
                icon: Bell,
                title: 'Smart Reminders',
                description: 'Get notified before deadlines. Customize your reminder schedule.',
              },
              {
                icon: FileText,
                title: 'Document Vault',
                description: 'Store CVs, essays, and transcripts. Version history included.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 rounded-[14px] bg-[#F8FAFC] border border-[#E2E8F0] hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-[#1E3A8A]/10 mb-4">
                  <feature.icon className="w-6 h-6 text-[#1E3A8A]" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-[#0F172A] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#64748B] text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-[#0F172A] mb-4">
              Why Students Love OpTracker
            </h2>
          </div>

          <div className="space-y-4">
            {[
              'Save opportunities from any website with one click',
              'Track application status from interested to accepted',
              'Get reminders 7, 3, and 1 day before deadlines',
              'Store all your documents in one secure place',
              'Never lose track of what you\'ve applied to',
            ].map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-4 p-4 rounded-lg bg-white border border-[#E2E8F0]"
              >
                <CheckCircle2 className="w-5 h-5 text-[#14B8A6] flex-shrink-0" />
                <span className="text-[#0F172A]">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#1E3A8A]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading text-3xl sm:text-4xl font-semibold text-white mb-4">
            Ready to Get Organized?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join students who are already tracking their opportunities with OpTracker.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-[#1E3A8A] hover:bg-white/90"
            >
              Create Free Account
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
            <span className="font-heading font-semibold text-[#0F172A]">OpTracker</span>
          </div>
          <p className="text-sm text-[#64748B]">
            © {new Date().getFullYear()} OpTracker. Made for students.
          </p>
        </div>
      </footer>
    </div>
  )
}
