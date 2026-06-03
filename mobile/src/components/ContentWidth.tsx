import React from 'react';

import { Platform, StyleSheet, View, ViewStyle } from 'react-native';

import { colors } from '../constants/colors';



const MAX_WIDTH = 520;



type Props = {

  children: React.ReactNode;

  style?: ViewStyle;

  grow?: boolean;

  /** card = bordered panel on web; plain = full-width content (onboarding shells) */

  variant?: 'card' | 'plain';

};



/** Centers content on wide web viewports; optional card panel on web. */

export function ContentWidth({

  children,

  style,

  grow = true,

  variant = 'card',

}: Props) {

  const isWebCard = Platform.OS === 'web' && variant === 'card';



  return (

    <View style={[grow && styles.grow, styles.outer, style]}>

      <View style={[grow && styles.grow, isWebCard ? styles.innerCard : styles.innerPlain]}>

        {children}

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  grow: { flex: 1 },

  outer: {

    width: '100%',

    alignItems: 'center',

    backgroundColor: Platform.OS === 'web' ? colors.scaffold : undefined,

  },

  innerPlain: {

    width: '100%',

    maxWidth: Platform.OS === 'web' ? MAX_WIDTH : undefined,

    flex: 1,

  },

  innerCard: {

    width: '100%',

    maxWidth: Platform.OS === 'web' ? MAX_WIDTH : undefined,

    backgroundColor: colors.surface,

    borderRadius: 16,

    borderWidth: 1,

    borderColor: colors.divider,

    marginVertical: 8,

    paddingHorizontal: 0,

    overflow: 'hidden',

    alignSelf: 'center',

  },

});

