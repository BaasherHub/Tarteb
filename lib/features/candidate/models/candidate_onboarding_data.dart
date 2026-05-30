/// In-memory state passed across the 5-step candidate onboarding flow.
class CandidateOnboardingData {
  const CandidateOnboardingData({
    this.photoUrl,
    this.role,
    this.visaStatus,
    this.salaryExpectation,
    this.location,
    this.phone,
    this.whatsapp,
    this.availableFrom,
    this.nationality,
    this.name,
    this.candidateId,
  });

  final String? photoUrl;
  final String? role;
  final String? visaStatus;
  final int? salaryExpectation;
  final String? location;
  final String? phone;
  final String? whatsapp;
  final DateTime? availableFrom;
  final String? nationality;
  final String? name;
  final String? candidateId;

  bool get isEditing => candidateId != null;

  CandidateOnboardingData copyWith({
    String? photoUrl,
    String? role,
    String? visaStatus,
    int? salaryExpectation,
    String? location,
    String? phone,
    String? whatsapp,
    DateTime? availableFrom,
    String? nationality,
    String? name,
    String? candidateId,
  }) {
    return CandidateOnboardingData(
      photoUrl: photoUrl ?? this.photoUrl,
      role: role ?? this.role,
      visaStatus: visaStatus ?? this.visaStatus,
      salaryExpectation: salaryExpectation ?? this.salaryExpectation,
      location: location ?? this.location,
      phone: phone ?? this.phone,
      whatsapp: whatsapp ?? this.whatsapp,
      availableFrom: availableFrom ?? this.availableFrom,
      nationality: nationality ?? this.nationality,
      name: name ?? this.name,
      candidateId: candidateId ?? this.candidateId,
    );
  }

  factory CandidateOnboardingData.fromCandidateRow(Map<String, dynamic> row) {
    final availableFrom = row['available_from'];
    return CandidateOnboardingData(
      candidateId: row['id'] as String?,
      photoUrl: row['photo_url'] as String?,
      role: row['role'] as String?,
      visaStatus: row['visa_status'] as String?,
      salaryExpectation: row['salary_expectation'] as int?,
      location: row['location'] as String?,
      phone: row['phone'] as String?,
      whatsapp: row['whatsapp'] as String?,
      nationality: row['nationality'] as String?,
      name: row['name'] as String?,
      availableFrom: availableFrom != null
          ? DateTime.tryParse(availableFrom.toString())
          : null,
    );
  }
}
