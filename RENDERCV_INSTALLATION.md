# RenderCV Installation Guide

## Prerequisites

- Python 3.8 or higher (tested with Python 3.13.5)
- pip (Python package manager)

## Installation Steps

### Option 1: Using Virtual Environment (Recommended)

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate  # On Windows
```

3. Install RenderCV with full features:
```bash
pip install "rendercv[full]"
```

4. Verify installation:
```bash
rendercv --version
```

Expected output: `RenderCV v2.6` (or later)

### Option 2: Using pipx (Alternative)

If you have pipx installed:
```bash
pipx install "rendercv[full]"
```

### Option 3: System-wide Installation (Not Recommended on macOS)

On some systems (especially macOS with Homebrew Python), you may need to use:
```bash
pip3 install --user "rendercv[full]"
```

Or with the `--break-system-packages` flag (use with caution):
```bash
pip3 install --break-system-packages "rendercv[full]"
```

## Testing Installation

Test RenderCV with a sample YAML file:

```bash
rendercv render path/to/resume.yaml
```

## Troubleshooting

### "command not found: rendercv"

If you installed in a virtual environment, make sure it's activated:
```bash
source venv/bin/activate
```

### "externally-managed-environment" error

This is common on macOS with Homebrew Python. Use a virtual environment (Option 1) or pipx (Option 2).

### Missing dependencies

Make sure you installed the full version with `[full]` suffix:
```bash
pip install "rendercv[full]"
```

## Version Information

- Tested with: RenderCV v2.6
- Python version: 3.13.5
- Platform: macOS (darwin)

## Integration with LiveCV

The LiveCV server expects RenderCV to be available in the system PATH. If using a virtual environment:

1. Activate the virtual environment before starting the server
2. Or update the server startup script to activate the venv automatically
3. Or install RenderCV system-wide using pipx

## Additional Resources

- RenderCV Documentation: https://docs.rendercv.com
- RenderCV GitHub: https://github.com/sinaatalay/rendercv
