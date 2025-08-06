import PageFlip from 'react-pageflip'

function AlbumPage({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-book" style={{ width: '100%', height: '600px' }}>
      {children}
    </div>
  )
}