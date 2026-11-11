$ErrorActionPreference = "Stop"

$Root = Split-Path -Parent $MyInvocation.MyCommand.Path
$Prefix = "http://127.0.0.1:4173/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($Prefix)
$listener.Start()

Write-Host "Preview running at $Prefix"
Write-Host "Serving files from $Root"
Write-Host "Close this window to stop the preview server."

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/")).TrimEnd("/")

  if ([string]::IsNullOrWhiteSpace($requestPath)) {
    $requestPath = "index.html"
  }

  $fullPath = [System.IO.Path]::GetFullPath([System.IO.Path]::Combine($Root, $requestPath))

  if (-not $fullPath.StartsWith($Root)) {
    $context.Response.StatusCode = 403
    $context.Response.Close()
    continue
  }

  if ([System.IO.Directory]::Exists($fullPath)) {
    $fullPath = [System.IO.Path]::Combine($fullPath, "index.html")
  }

  if (-not [System.IO.File]::Exists($fullPath)) {
    $notFound = [System.IO.Path]::Combine($Root, "404.html")
    if ([System.IO.File]::Exists($notFound)) {
      $fullPath = $notFound
      $context.Response.StatusCode = 404
    } else {
      $context.Response.StatusCode = 404
      $context.Response.Close()
      continue
    }
  }

  $extension = [System.IO.Path]::GetExtension($fullPath)
  $contentType = switch ($extension) {
    ".html" { "text/html; charset=utf-8" }
    ".css" { "text/css; charset=utf-8" }
    ".js" { "text/javascript; charset=utf-8" }
    ".xml" { "application/xml; charset=utf-8" }
    ".txt" { "text/plain; charset=utf-8" }
    ".svg" { "image/svg+xml" }
    ".webp" { "image/webp" }
    ".jpg" { "image/jpeg" }
    ".jpeg" { "image/jpeg" }
    ".png" { "image/png" }
    ".ico" { "image/x-icon" }
    ".webmanifest" { "application/manifest+json" }
    default { "application/octet-stream" }
  }

  $bytes = [System.IO.File]::ReadAllBytes($fullPath)
  $context.Response.ContentType = $contentType
  $context.Response.Headers.Add("Cache-Control", "no-store")
  $context.Response.ContentLength64 = $bytes.Length
  $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $context.Response.Close()
}
