import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="shrink-0 border-t border-amber-300 bg-gradient-to-r from-orange-700 via-amber-500 to-orange-700 px-4 py-2 text-center text-[11px] text-white sm:flex sm:items-center sm:justify-between sm:px-6 sm:text-xs">
      <p>
        &copy; 2026{' '}
        <Link href="/" className="font-medium text-white hover:underline">
          pandal-navigation.vercel.app
        </Link>
        . All rights reserved.
      </p>
      <p className="mt-1 sm:mt-0">Developed by Parth Armarkar</p>
    </footer>
  )
}
