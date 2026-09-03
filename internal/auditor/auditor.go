package auditor

import (
"context"
"io"
"net/http"
"time"
)

type Result struct {
Status    string `json:"status"`
HTTPCode  int    `json:"httpCode,omitempty"`
URL       string `json:"url"`
Error     string `json:"error,omitempty"`
Timestamp string `json:"timestamp"`
}

func AuditarURL(targetURL string, timeoutMs int) Result {
if targetURL == "" {
targetURL = "https://www.google.com/search?q=comoobtener+un+dom"
}
if timeoutMs == 0 {
timeoutMs = 8000
}
ts := time.Now().UTC().Format(time.RFC3339)
ctx, cancel := context.WithTimeout(context.Background(), time.Duration(timeoutMs)*time.Millisecond)
defer cancel()

req, _ := http.NewRequestWithContext(ctx, "GET", targetURL, nil)
req.Header.Set("User-Agent", "Diamond-Orchestrator/1.0 (URL-Auditor)")
req.Header.Set("Accept", "*/*")

resp, err := http.DefaultClient.Do(req)
if err != nil {
errMsg := err.Error()
if ctx.Err() == context.DeadlineExceeded {
errMsg = "Timeout tras " + time.Duration(timeoutMs).String()
}
return Result{Status: "ERROR", URL: targetURL, Error: errMsg, Timestamp: ts}
}
defer resp.Body.Close()
io.Copy(io.Discard, resp.Body) // liberar memoria sin almacenar

status := "WARN"
if resp.StatusCode >= 200 && resp.StatusCode < 400 {
status = "STABLE"
}
return Result{Status: status, HTTPCode: resp.StatusCode, URL: targetURL, Timestamp: ts}
}
