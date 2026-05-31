import 'dart:typed_data';

import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:tarteb/core/constants/app_colors.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/core/l10n/locale_service.dart';
import 'package:tarteb/core/theme/app_spacing.dart';
import 'package:tarteb/features/candidate/models/candidate_onboarding_data.dart';
import 'package:tarteb/features/candidate/screens/onboarding/step3_visa_status.dart';
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
  Uint8List? _localPreviewBytes;
  String? _photoUrl;
  bool _uploading = false;
  String? _uploadError;
  String? _selectedRole;

  @override
  void initState() {
    super.initState();
    _photoUrl = widget.data.photoUrl;
    _selectedRole = widget.data.role;
  }

  ImageProvider? get _avatarImage {
    if (_localPreviewBytes != null) {
      return MemoryImage(_localPreviewBytes!);
    }
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

    final bytes = await file.readAsBytes();
    setState(() {
      _localPreviewBytes = bytes;
      _uploading = true;
      _uploadError = null;
    });

    try {
      final url = await CandidatePhotoService.upload(file);
      setState(() => _photoUrl = url);
    } catch (e) {
      setState(() {
        _uploadError = e.toString();
        _localPreviewBytes = null;
        _photoUrl = widget.data.photoUrl;
      });
    } finally {
      if (mounted) setState(() => _uploading = false);
    }
  }

  void _continue({bool skipPhoto = false}) {
    if (_selectedRole == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(AppStrings.jobRole)),
      );
      return;
    }

    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Step3VisaStatusScreen(
          data: widget.data.copyWith(
            photoUrl: skipPhoto ? null : _photoUrl,
            role: _selectedRole,
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: LocaleService.instance,
      builder: (context, _) {
        return Scaffold(
          appBar: AppBar(
            title: Text(
              widget.data.isEditing
                  ? AppStrings.editProfile
                  : AppStrings.yourPhoto,
            ),
          ),
          body: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const OnboardingProgressBar(currentStep: 1),
              Expanded(
                child: SingleChildScrollView(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    children: [
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          CircleAvatar(
                            radius: 72,
                            backgroundColor:
                                AppColors.primary.withValues(alpha: 0.1),
                            backgroundImage: _avatarImage,
                            child: _avatarImage == null
                                ? Icon(
                                    Icons.person,
                                    size: 72,
                                    color: AppColors.primary
                                        .withValues(alpha: 0.5),
                                  )
                                : null,
                          ),
                          if (_uploading)
                            const Positioned(
                              child: CircularProgressIndicator(),
                            ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.xl),
                      Text(
                        AppStrings.addClearPhoto,
                        textAlign: TextAlign.center,
                      ),
                      if (_uploadError != null) ...[
                        const SizedBox(height: 12),
                        Text(
                          _uploadError!,
                          style: const TextStyle(color: AppColors.error),
                          textAlign: TextAlign.center,
                        ),
                      ],
                      const SizedBox(height: AppSpacing.xl),
                      if (kIsWeb)
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton.icon(
                            onPressed: _uploading
                                ? null
                                : () => _pick(ImageSource.gallery),
                            icon: const Icon(Icons.photo_library),
                            label: Text(AppStrings.gallery),
                          ),
                        )
                      else
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: _uploading
                                    ? null
                                    : () => _pick(ImageSource.camera),
                                icon: const Icon(Icons.camera_alt),
                                label: Text(AppStrings.camera),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: _uploading
                                    ? null
                                    : () => _pick(ImageSource.gallery),
                                icon: const Icon(Icons.photo_library),
                                label: Text(AppStrings.gallery),
                              ),
                            ),
                          ],
                        ),
                      const SizedBox(height: AppSpacing.xxl),
                      Align(
                        alignment: AlignmentDirectional.centerStart,
                        child: Text(
                          AppStrings.jobRole,
                          style: Theme.of(context).textTheme.titleSmall?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                        ),
                      ),
                      const SizedBox(height: AppSpacing.md),
                      GridView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        gridDelegate:
                            const SliverGridDelegateWithFixedCrossAxisCount(
                          crossAxisCount: 2,
                          mainAxisSpacing: 8,
                          crossAxisSpacing: 8,
                          childAspectRatio: 1.5,
                        ),
                        itemCount: AppStrings.candidateRoles.length,
                        itemBuilder: (context, index) {
                          final role = AppStrings.candidateRoles[index];
                          final selected = _selectedRole == role;
                          return Material(
                            color: selected
                                ? AppColors.primary.withValues(alpha: 0.12)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(12),
                            child: InkWell(
                              onTap: () => setState(() => _selectedRole = role),
                              borderRadius: BorderRadius.circular(12),
                              child: Container(
                                alignment: Alignment.center,
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(
                                    color: selected
                                        ? AppColors.primary
                                        : AppColors.divider,
                                  ),
                                ),
                                padding: const EdgeInsets.all(8),
                                child: Text(
                                  role,
                                  textAlign: TextAlign.center,
                                  style: TextStyle(
                                    fontWeight: selected
                                        ? FontWeight.w600
                                        : FontWeight.normal,
                                    color: selected
                                        ? AppColors.primary
                                        : AppColors.textPrimary,
                                  ),
                                ),
                              ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    FilledButton(
                      onPressed: _uploading || _selectedRole == null
                          ? null
                          : () => _continue(),
                      child: Text(AppStrings.continueLabel),
                    ),
                    TextButton(
                      onPressed: _uploading || _selectedRole == null
                          ? null
                          : () => _continue(skipPhoto: true),
                      child: Text(AppStrings.skipForNow),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
