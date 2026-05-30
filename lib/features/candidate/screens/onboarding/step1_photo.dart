import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step2_role.dart';
import 'package:tarteb/features/candidate/services/candidate_photo_service.dart';
import 'package:tarteb/features/candidate/widgets/onboarding_progress_bar.dart';

class Step1PhotoScreen extends StatefulWidget {
  const Step1PhotoScreen({
    super.key,
    this.data = const CandidateOnboardingData(),
  });

  final CandidateOnboardingData data;

  @override
  State<Step1PhotoScreen> createState() => _Step1PhotoScreenState();
}

class _Step1PhotoScreenState extends State<Step1PhotoScreen> {
  final _picker = ImagePicker();
  String? _localPreviewPath;
  String? _photoUrl;
  bool _uploading = false;

  @override
  void initState() {
    super.initState();
    _photoUrl = widget.data.photoUrl;
  }

  ImageProvider? get _avatarImage {
    if (_localPreviewPath != null) return FileImage(File(_localPreviewPath!));
    if (_photoUrl != null) return NetworkImage(_photoUrl!);
    return null;
  }

  Future<void> _pick(ImageSource source) async {
    final file = await _picker.pickImage(
      source: source,
      maxWidth: 1200,
      imageQuality: 85,
    );
    if (file == null) return;

    setState(() {
      _localPreviewPath = file.path;
      _uploading = true;
    });

    try {
      final url = await CandidatePhotoService.upload(file);
      setState(() => _photoUrl = url);
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Upload failed: $e')),
        );
      }
      setState(() {
        _localPreviewPath = null;
        _photoUrl = widget.data.photoUrl;
      });
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  void _continue() {
    if (_photoUrl == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add a photo to continue')),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Step2RoleScreen(
          data: widget.data.copyWith(photoUrl: _photoUrl),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.data.isEditing ? 'Edit profile' : 'Your photo'),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const OnboardingProgressBar(currentStep: 1),
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const SizedBox(height: 24),
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      CircleAvatar(
                        radius: 72,
                        backgroundColor:
                            AppColors.primary.withValues(alpha: 0.1),
                        backgroundImage: _avatarImage,
                        child: _avatarImage == null
                            ? const Icon(Icons.person, size: 72)
                            : null,
                      ),
                      if (_uploading)
                        const Positioned(
                          child: CircularProgressIndicator(),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'Add a clear photo of yourself',
                    textAlign: TextAlign.center,
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed:
                              _uploading ? null : () => _pick(ImageSource.camera),
                          icon: const Icon(Icons.camera_alt),
                          label: const Text('Camera'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _uploading
                              ? null
                              : () => _pick(ImageSource.gallery),
                          icon: const Icon(Icons.photo_library),
                          label: const Text('Gallery'),
                        ),
                      ),
                    ],
                  ),
                  const Spacer(),
                  FilledButton(
                    onPressed: _uploading ? null : _continue,
                    child: const Text('Continue'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
