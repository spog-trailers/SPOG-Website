"""Cut a trailer out of its photo, for the lineup panels on /test-home-2.

It uses Apple's Vision subject lifting, the same thing as "Copy Subject" in Photos. It runs on
this Mac and sends nothing anywhere. The result is a WebP with a transparent background.

One-time setup (any folder outside the repo):
    python3 -m venv venv && ./venv/bin/pip install pyobjc-framework-Vision pyobjc-framework-Quartz pillow

Usage:
    ./venv/bin/python scripts/cutout.py <photo> public/images/lineup-<name>.webp [--width 1700]

Run it in a normal terminal. Inside Claude Code's sandbox the Mac's image model can't load.
Check the edges afterwards. Vision keeps anything touching the trailer (a wall sign behind the
roof, a table by the hitch) and drops thin parts like a raised mast. The 2026-11-18 cut-outs
were retouched by hand after this step (see CLAUDE.md).
"""
import argparse
import os
import tempfile

import Quartz
import Vision
from Foundation import NSURL
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument("src")
parser.add_argument("dst")
parser.add_argument("--width", type=int, default=1700, help="largest width of the saved image, in px")
args = parser.parse_args()

image = Quartz.CIImage.imageWithContentsOfURL_options_(
    NSURL.fileURLWithPath_(args.src), {Quartz.kCIImageApplyOrientationProperty: True}
)
handler = Vision.VNImageRequestHandler.alloc().initWithCIImage_options_(image, {})
request = Vision.VNGenerateForegroundInstanceMaskRequest.alloc().init()
ok, error = handler.performRequests_error_([request], None)
if not ok or not request.results():
    raise SystemExit(f"No subject found in {args.src}: {error}")

result = request.results()[0]
buffer, error = result.generateMaskedImageOfInstances_fromRequestHandler_croppedToInstancesExtent_error_(
    result.allInstances(), handler, True, None
)
cut = Quartz.CIImage.imageWithCVPixelBuffer_(buffer)

with tempfile.TemporaryDirectory() as tmp:
    png = os.path.join(tmp, "cut.png")
    Quartz.CIContext.context().writePNGRepresentationOfImage_toURL_format_colorSpace_options_error_(
        cut, NSURL.fileURLWithPath_(png), Quartz.kCIFormatRGBA8,
        Quartz.CGColorSpaceCreateWithName(Quartz.kCGColorSpaceSRGB), {}, None,
    )
    out = Image.open(png).convert("RGBA")
    out = out.crop(out.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
    if out.width > args.width:
        out = out.resize((args.width, round(out.height * args.width / out.width)), Image.LANCZOS)
    out.save(args.dst, quality=86, method=6)
    print(f"Saved {args.dst} at {out.width} x {out.height} px")
