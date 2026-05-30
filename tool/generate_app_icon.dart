// Generates assets/icon/app_icon.png — white briefcase on #1A73E8.
// Run: dart run tool/generate_app_icon.dart

import 'dart:io';

import 'package:image/image.dart' as img;

void main() {
  const size = 1024;
  final blue = img.ColorRgb8(26, 115, 232);
  final image = img.Image(width: size, height: size);
  img.fill(image, color: blue);

  // Briefcase body
  _fillRect(image, 280, 420, 744, 720, 0xFFFFFFFF);
  // Briefcase flap
  _fillRect(image, 240, 360, 784, 460, 0xFFFFFFFF);
  // Handle
  _fillRect(image, 420, 280, 604, 360, 0xFFFFFFFF);
  // Lock accent (primary blue cutout)
  _fillRect(image, 470, 520, 554, 600, 0xFF1A73E8);

  final dir = Directory('assets/icon');
  if (!dir.existsSync()) dir.createSync(recursive: true);
  File('assets/icon/app_icon.png')
      .writeAsBytesSync(img.encodePng(image));
  stdout.writeln('Wrote assets/icon/app_icon.png');
}

void _fillRect(
  img.Image image,
  int x1,
  int y1,
  int x2,
  int y2,
  int argb,
) {
  final a = (argb >> 24) & 0xFF;
  final r = (argb >> 16) & 0xFF;
  final g = (argb >> 8) & 0xFF;
  final b = argb & 0xFF;
  for (var y = y1; y < y2; y++) {
    for (var x = x1; x < x2; x++) {
      if (x >= 0 && x < image.width && y >= 0 && y < image.height) {
        image.setPixelRgba(x, y, r, g, b, a == 0 ? 255 : a);
      }
    }
  }
}
