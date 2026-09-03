package main

import (
"encoding/json"
"fmt"
"didactic-octo-chrome/internal/auditor"
)

func main() {
res := auditor.AuditarURL("", 8000)
b, _ := json.MarshalIndent(res, "", "  ")
fmt.Println(string(b))
}
