export function Footer() {
  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <p className="text-sm text-muted-foreground">
          © 2024 Rosco Game. Todos los derechos reservados.
        </p>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>Hecho con ❤️ y Next.js</span>
        </div>
      </div>
    </footer>
  )
}