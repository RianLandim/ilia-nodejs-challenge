export function Footer() {
  return (
    <footer className="border-t bg-background py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Ília Wallet. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
