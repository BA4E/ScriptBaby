@echo off

set flag=%1

if %flag% == ON (
    dism /Online /enable-feature /featureName:VirtualMachinePlatform /norestart
    dism /Online /Get-FeatureInfo /FeatureName:VirtualMachinePlatform
)
if %flag% == OFF (
    dism /online /disable-feature /featurename:VirtualMachinePlatform /norestart
    dism /Online /Get-FeatureInfo /FeatureName:VirtualMachinePlatform
)
