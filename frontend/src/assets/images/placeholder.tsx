// This is a placeholder file since we can't generate an actual image
// In a real project, you would add a proper PNG or JPG file here
// Using this module exports a component that renders a colored rectangle
import React from 'react';
import { View } from 'react-native';
import { colors } from '../../styles/theme';

const PlaceholderImage = () => (
  <View style={{ 
    width: '100%', 
    height: '100%', 
    backgroundColor: colors.blue + '50',
    justifyContent: 'center',
    alignItems: 'center'
  }} />
);

export default PlaceholderImage;
