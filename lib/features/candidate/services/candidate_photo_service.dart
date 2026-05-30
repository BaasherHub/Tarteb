import 'package:image_picker/image_picker.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:tarteb/core/supabase/supabase_client.dart';

abstract final class CandidatePhotoService {
  static const String bucket = 'candidate-photos';

  static Future<String> upload(XFile file) async {
    final userId = TartebSupabase.auth.currentUser!.id;
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final name = file.name;
    final extension = name.contains('.')
        ? name.split('.').last.toLowerCase()
        : 'jpg';
    final safeExt = ['jpg', 'jpeg', 'png', 'webp'].contains(extension)
        ? extension
        : 'jpg';
    final path = '$userId/${userId}_$timestamp.$safeExt';

    final bytes = await file.readAsBytes();
    final contentType = safeExt == 'png'
        ? 'image/png'
        : safeExt == 'webp'
            ? 'image/webp'
            : 'image/jpeg';

    await TartebSupabase.client.storage.from(bucket).uploadBinary(
          path,
          bytes,
          fileOptions: FileOptions(contentType: contentType, upsert: true),
        );

    return TartebSupabase.client.storage.from(bucket).getPublicUrl(path);
  }
}
