!macro customInstall
  DetailPrint "Register infinityapp URI Handler"
  DeleteRegKey HKCR "infinity"
  DeleteRegKey HKCR "infinityapp"
  WriteRegStr HKCR "infinityapp" "" "URL:infinityapp"
  WriteRegStr HKCR "infinityapp" "URL Protocol" ""
  WriteRegStr HKCR "infinityapp\DefaultIcon" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME}"
  WriteRegStr HKCR "infinityapp\shell" "" ""
  WriteRegStr HKCR "infinityapp\shell\Open" "" ""
  WriteRegStr HKCR "infinityapp\shell\Open\command" "" "$INSTDIR\${APP_EXECUTABLE_FILENAME} %1"
!macroend
