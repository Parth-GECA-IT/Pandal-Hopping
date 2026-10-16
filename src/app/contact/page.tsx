'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Check, Mail, Pencil, Plus } from 'lucide-react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { UserLocation } from '@/types/pandal'

const contactEmail = 'nagpurpandals@gmail.com'

const addPandalBody = [
  'I would like to add a pandal to Nagpur Pandal Map.',
  '',
  'Pandal details:',
  'Festival: Ganeshotsav (ID 1) or Durga Utsav (ID 2)',
  'Pandal name:',
  'Short description:',
  'Full address in Nagpur:',
  'Coordinates (latitude, longitude):',
  'Visiting timings:',
  '',
  'Optional details:',
  'Contact phone number:',
  'Website or social media link:',
  'Rating (1-5):',
  'Special features or facilities:',
  'Image URL:',
  '',
  'Your name:',
  'Reply email or phone number:',
].join('\n')

const editPandalBody = [
  'I would like to request an edit to a pandal listing on Nagpur Pandal Map.',
  '',
  'Existing pandal name:',
  'Festival: Ganeshotsav (ID 1) or Durga Utsav (ID 2)',
  'Existing address or listing details to identify it:',
  '',
  'Fields to change and corrected information:',
  '1.',
  '2.',
  '3.',
  '',
  'Optional: links or images that support the requested changes:',
  '',
  'Your name:',
  'Reply email or phone number:',
].join('\n')

function createMailtoHref(subject: string, body: string) {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

const addPandalHref = createMailtoHref('Add a pandal to Nagpur Pandal Map', addPandalBody)
const editPandalHref = createMailtoHref('Edit a pandal on Nagpur Pandal Map', editPandalBody)

export default function ContactPage() {
  const [userLocation, setUserLocation] = useState<UserLocation | undefined>()

  return (
    <div className="flex min-h-screen flex-col">
      <Header onLocationUpdate={setUserLocation} userLocation={userLocation} />
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-orange-800 transition hover:text-orange-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to map
          </Link>

          <header className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-orange-700">Nagpur Pandal Map</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">Add or edit a pandal</h1>
            <p className="mt-3 max-w-2xl leading-relaxed text-slate-600">
              Help keep the map accurate. Choose the request type below to open an email with the relevant
              details ready to fill in.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="flex flex-col rounded-2xl border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Plus className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold text-slate-900">Add a pandal</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                Please provide these required details:
              </p>
              <ul className="mb-5 space-y-2 text-sm text-slate-700">
                {[
                  'Festival: Ganeshotsav or Durga Utsav',
                  'Pandal name and short description',
                  'Full address in Nagpur',
                  'Coordinates (latitude and longitude)',
                  'Visiting timings',
                ].map(detail => (
                  <li key={detail} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                Optional: contact phone, website or social media, rating (1-5), special features or facilities,
                and an image URL. Include your name and a reply email or phone number.
              </p>
              <a
                href={addPandalHref}
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700"
              >
                <Mail className="h-4 w-4" />
                Email to add a pandal
              </a>
            </section>

            <section className="flex flex-col rounded-2xl border border-orange-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                  <Pencil className="h-5 w-5" />
                </span>
                <h2 className="text-xl font-semibold text-slate-900">Edit a pandal</h2>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                To help us find the listing and make the right change, include:
              </p>
              <ul className="mb-5 space-y-2 text-sm text-slate-700">
                {[
                  'Existing pandal name',
                  'Festival and current address or other identifying details',
                  'The exact fields that need to change',
                  'Corrected information for each field',
                ].map(detail => (
                  <li key={detail} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                You can also attach links or images that support the changes. Include your name and a reply
                email or phone number.
              </p>
              <a
                href={editPandalHref}
                className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-600 to-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:from-orange-700 hover:to-red-700"
              >
                <Mail className="h-4 w-4" />
                Email to edit a pandal
              </a>
            </section>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            Email requests to{' '}
            <a className="font-medium text-orange-800 underline hover:text-orange-950" href={`mailto:${contactEmail}`}>
              {contactEmail}
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
