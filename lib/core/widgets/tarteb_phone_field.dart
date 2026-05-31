import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:tarteb/core/constants/app_strings.dart';
import 'package:tarteb/features/auth/constants/phone_countries.dart';

/// Country chip + national number in one row.
class TartebPhoneField extends StatelessWidget {
  const TartebPhoneField({
    super.key,
    required this.country,
    required this.controller,
    required this.onCountryChanged,
    this.enabled = true,
  });

  final PhoneCountry country;
  final TextEditingController controller;
  final ValueChanged<PhoneCountry> onCountryChanged;
  final bool enabled;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        PopupMenuButton<PhoneCountry>(
          enabled: enabled,
          initialValue: country,
          tooltip: AppStrings.country,
          child: Container(
            height: 56,
            padding: const EdgeInsets.symmetric(horizontal: 12),
            decoration: BoxDecoration(
              border: Border.all(color: Theme.of(context).dividerColor),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  country.dialCode,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
                const Icon(Icons.arrow_drop_down),
              ],
            ),
          ),
          itemBuilder: (context) => PhoneCountries.all
              .map(
                (c) => PopupMenuItem(
                  value: c,
                  child: Text(c.label),
                ),
              )
              .toList(),
          onSelected: onCountryChanged,
        ),
        const SizedBox(width: 8),
        Expanded(
          child: TextField(
            controller: controller,
            enabled: enabled,
            keyboardType: TextInputType.phone,
            inputFormatters: [FilteringTextInputFormatter.digitsOnly],
            decoration: InputDecoration(
              labelText: AppStrings.enterPhone,
              hintText: '501234567',
            ),
          ),
        ),
      ],
    );
  }
}
