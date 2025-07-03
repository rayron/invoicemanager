import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ViewType } from '../types';
import { styles } from '../styles';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  invoiceCount?: number;
  clientCount?: number;
  paymentCount?: number;
  pendingInvoices?: number;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  invoiceCount = 0,
  clientCount = 0,
  paymentCount = 0,
  pendingInvoices = 0
}) => {
  const navItems: Array<{
    key: ViewType;
    label: string;
    badge?: number;
    badgeColor?: string;
  }> = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      badge: pendingInvoices > 0 ? pendingInvoices : undefined,
      badgeColor: '#FF9800'
    },
    {
      key: 'clients',
      label: 'Clients',
      badge: clientCount > 0 ? clientCount : undefined,
      badgeColor: '#2196F3'
    },
    {
      key: 'invoices',
      label: 'Invoices',
      badge: invoiceCount > 0 ? invoiceCount : undefined,
      badgeColor: '#4CAF50'
    },
    {
      key: 'payments',
      label: 'Payments',
      badge: paymentCount > 0 ? paymentCount : undefined,
      badgeColor: '#9C27B0'
    }
  ];

  return (
    <View style={styles.nav}>
      {navItems.map(item => (
        <TouchableOpacity
          key={item.key}
          style={[
            styles.navButton,
            currentView === item.key && styles.navButtonActive
          ]}
          onPress={() => onViewChange(item.key)}
          activeOpacity={0.7}
        >
          <View style={styles.navButtonContent}>
            <Text style={[
              styles.navButtonText,
              currentView === item.key && styles.navButtonTextActive
            ]}>
              {item.label}
            </Text>
            
            {item.badge && item.badge > 0 && (
              <View style={[
                styles.navBadge,
                { backgroundColor: item.badgeColor || '#FF5722' }
              ]}>
                <Text style={styles.navBadgeText}>
                  {item.badge > 99 ? '99+' : item.badge.toString()}
                </Text>
              </View>
            )}
          </View>
          
          {currentView === item.key && (
            <View style={styles.navActiveIndicator} />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};