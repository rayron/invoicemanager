import { StyleSheet, Platform } from 'react-native';

// Color palette
export const colors = {
    // Primary colors
    primary: '#2196F3',
    primaryDark: '#1976D2',
    primaryLight: '#E3F2FD',

    // Secondary colors
    secondary: '#4CAF50',
    secondaryDark: '#388E3C',
    secondaryLight: '#E8F5E8',

    // Accent colors
    accent: '#FF9800',
    accentDark: '#F57C00',
    accentLight: '#FFF3E0',

    // Status colors
    error: '#F44336',
    warning: '#FF9800',
    success: '#4CAF50',
    info: '#2196F3',

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray50: '#FAFAFA',
    gray100: '#F5F5F5',
    gray200: '#EEEEEE',
    gray300: '#E0E0E0',
    gray400: '#BDBDBD',
    gray500: '#9E9E9E',
    gray600: '#757575',
    gray700: '#616161',
    gray800: '#424242',
    gray900: '#212121',

    // Semantic colors
    background: '#F5F5F5',
    surface: '#FFFFFF',
    onSurface: '#212121',
    onBackground: '#212121',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',

    // Invoice status colors
    draft: '#9E9E9E',
    sent: '#FF9800',
    paid: '#4CAF50',
    overdue: '#F44336',
    cancelled: '#757575',

    // Additional colors
    purple: '#9C27B0',
    indigo: '#3F51B5',
    teal: '#009688',
    cyan: '#00BCD4',
    lime: '#CDDC39',
    yellow: '#FFEB3B',
    amber: '#FFC107',
    orange: '#FF5722',
    brown: '#795548',
    blueGray: '#607D8B',
};

// Typography
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    h2: {
        fontSize: 28,
        fontWeight: 'bold' as const,
        lineHeight: 36,
        letterSpacing: -0.25,
    },
    h3: {
        fontSize: 24,
        fontWeight: 'bold' as const,
        lineHeight: 32,
        letterSpacing: 0,
    },
    h4: {
        fontSize: 20,
        fontWeight: 'bold' as const,
        lineHeight: 28,
        letterSpacing: 0.25,
    },
    h5: {
        fontSize: 18,
        fontWeight: 'bold' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },
    h6: {
        fontSize: 16,
        fontWeight: 'bold' as const,
        lineHeight: 22,
        letterSpacing: 0.15,
    },
    subtitle1: {
        fontSize: 16,
        fontWeight: '500' as const,
        lineHeight: 24,
        letterSpacing: 0.15,
    },
    subtitle2: {
        fontSize: 14,
        fontWeight: '500' as const,
        lineHeight: 20,
        letterSpacing: 0.1,
    },
    body1: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24,
        letterSpacing: 0.5,
    },
    body2: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0.25,
    },
    button: {
        fontSize: 14,
        fontWeight: '500' as const,
        lineHeight: 16,
        letterSpacing: 1.25,
        textTransform: 'uppercase' as const,
    },
    caption: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 0.4,
    },
    overline: {
        fontSize: 10,
        fontWeight: '400' as const,
        lineHeight: 16,
        letterSpacing: 1.5,
        textTransform: 'uppercase' as const,
    },
};

// Spacing
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
};

// Border radius
export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    round: 999,
};

// Shadows
export const shadows = {
    none: {
        elevation: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    xs: {
        elevation: 1,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.18,
        shadowRadius: 1,
    },
    sm: {
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.20,
        shadowRadius: 2,
    },
    md: {
        elevation: 4,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    lg: {
        elevation: 8,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.30,
        shadowRadius: 8,
    },
    xl: {
        elevation: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
    },
};

// Common styles
export const commonStyles = StyleSheet.create({
    // Layout
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    column: {
        flexDirection: 'column',
    },
    flex1: {
        flex: 1,
    },

    // Padding
    p0: { padding: 0 },
    pXs: { padding: spacing.xs },
    pSm: { padding: spacing.sm },
    pMd: { padding: spacing.md },
    pLg: { padding: spacing.lg },
    pXl: { padding: spacing.xl },

    // Margin
    m0: { margin: 0 },
    mXs: { margin: spacing.xs },
    mSm: { margin: spacing.sm },
    mMd: { margin: spacing.md },
    mLg: { margin: spacing.lg },
    mXl: { margin: spacing.xl },

    // Text alignment
    textLeft: { textAlign: 'left' },
    textCenter: { textAlign: 'center' },
    textRight: { textAlign: 'right' },

    // Text colors
    textPrimary: { color: colors.primary },
    textSecondary: { color: colors.gray600 },
    textError: { color: colors.error },
    textSuccess: { color: colors.success },
    textWarning: { color: colors.warning },
    textMuted: { color: colors.gray500 },

    // Background colors
    bgPrimary: { backgroundColor: colors.primary },
    bgSecondary: { backgroundColor: colors.secondary },
    bgSurface: { backgroundColor: colors.surface },
    bgError: { backgroundColor: colors.error },
    bgSuccess: { backgroundColor: colors.success },
    bgWarning: { backgroundColor: colors.warning },
});

// Main application styles
export const styles = StyleSheet.create({
    // App Container
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    // Header
    header: {
        backgroundColor: colors.primary,
        paddingTop: Platform.OS === 'ios' ? 44 : 24,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.md,
        ...shadows.sm,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.h4,
        color: colors.onPrimary,
        textAlign: 'center',
    },
    headerSubtitle: {
        ...typography.caption,
        color: colors.primaryLight,
        textAlign: 'center',
        marginTop: spacing.xs,
    },

    // Navigation
    nav: {
        flexDirection: 'row',
        backgroundColor: colors.surface,
        ...shadows.sm,
    },
    navButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    navButtonActive: {
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        backgroundColor: colors.primaryLight,
    },
    navButtonContent: {
        alignItems: 'center',
        position: 'relative',
    },
    navButtonText: {
        ...typography.caption,
        color: colors.gray600,
        fontWeight: '500',
    },
    navButtonTextActive: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    navBadge: {
        position: 'absolute',
        top: -spacing.xs,
        right: -spacing.sm,
        backgroundColor: colors.error,
        borderRadius: borderRadius.round,
        minWidth: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },
    navBadgeText: {
        ...typography.overline,
        color: colors.white,
        fontSize: 10,
    },
    navActiveIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: colors.primary,
    },

    // Content
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: spacing.md,
    },

    // Section Headers
    sectionTitle: {
        ...typography.h3,
        color: colors.onSurface,
        marginBottom: spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },

    // Stats Cards
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.lg,
        gap: spacing.sm,
    },
    statCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flex: 1,
        minWidth: 150,
        alignItems: 'center',
        ...shadows.sm,
    },
    statValue: {
        ...typography.h4,
        color: colors.primary,
        fontWeight: 'bold',
    },
    statLabel: {
        ...typography.caption,
        color: colors.gray600,
        marginTop: spacing.xs,
        textAlign: 'center',
    },

    // Client Cards
    clientCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    clientInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    clientName: {
        ...typography.subtitle1,
        color: colors.onSurface,
        fontWeight: 'bold',
    },
    clientCompany: {
        ...typography.body2,
        color: colors.gray600,
        marginTop: spacing.xs,
    },
    clientEmail: {
        ...typography.caption,
        color: colors.gray500,
        marginTop: spacing.xs,
    },
    clientPhone: {
        ...typography.caption,
        color: colors.gray500,
        marginTop: spacing.xs,
    },
    clientAddress: {
        ...typography.caption,
        color: colors.gray500,
        marginTop: spacing.xs,
    },
    clientActions: {
        flexDirection: 'row',
        gap: spacing.xs,
    },

    // Invoice Cards
    invoiceCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    invoiceInfo: {
        marginBottom: spacing.sm,
    },
    invoiceNumber: {
        ...typography.subtitle1,
        color: colors.onSurface,
        fontWeight: 'bold',
    },
    invoiceDate: {
        ...typography.caption,
        color: colors.gray600,
        marginTop: spacing.xs,
    },
    invoiceAmount: {
        ...typography.h5,
        color: colors.primary,
        fontWeight: 'bold',
        marginTop: spacing.xs,
    },
    invoiceStatus: {
        ...typography.caption,
        fontWeight: 'bold',
        marginTop: spacing.xs,
    },
    invoiceItemsSummary: {
        marginTop: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.gray50,
        borderRadius: borderRadius.sm,
    },
    invoiceItemsTitle: {
        ...typography.caption,
        fontWeight: 'bold',
        color: colors.gray700,
        marginBottom: spacing.xs,
    },
    invoiceItemText: {
        ...typography.caption,
        color: colors.gray600,
        marginBottom: spacing.xxs,
    },
    invoiceActions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },

    // Payment Cards
    paymentCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        ...shadows.sm,
    },
    paymentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    paymentAmount: {
        ...typography.h5,
        color: colors.success,
        fontWeight: 'bold',
    },
    paymentDetails: {
        marginBottom: spacing.xs,
    },
    paymentMeta: {
        gap: spacing.xxs,
    },
    paymentDate: {
        ...typography.caption,
        color: colors.gray600,
    },
    paymentMethod: {
        ...typography.caption,
        color: colors.gray600,
    },
    paymentNotes: {
        ...typography.caption,
        color: colors.gray500,
        fontStyle: 'italic',
    },

    // Month sections for payments
    monthSection: {
        marginBottom: spacing.lg,
    },
    monthTitle: {
        ...typography.h6,
        color: colors.onSurface,
        marginBottom: spacing.xs,
    },
    monthSubtitle: {
        ...typography.caption,
        color: colors.gray600,
        marginBottom: spacing.sm,
    },

    // Buttons
    addButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 36,
    },
    addButtonText: {
        ...typography.button,
        color: colors.onPrimary,
        fontSize: 12,
    },
    editButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
    },
    editButtonText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: colors.error,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
    },
    deleteButtonText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: 'bold',
    },
    sendButton: {
        backgroundColor: colors.accent,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
    },
    sendButtonText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: 'bold',
    },
    paymentButton: {
        backgroundColor: colors.purple,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 28,
    },
    paymentButtonText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: 'bold',
    },

    // Status badges
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignSelf: 'flex-start',
        marginTop: spacing.xs,
    },
    statusText: {
        ...typography.caption,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    statusDraft: {
        backgroundColor: colors.gray200,
    },
    statusTextDraft: {
        color: colors.gray700,
    },
    statusSent: {
        backgroundColor: colors.accentLight,
    },
    statusTextSent: {
        color: colors.accentDark,
    },
    statusPaid: {
        backgroundColor: colors.secondaryLight,
    },
    statusTextPaid: {
        color: colors.secondaryDark,
    },
    statusOverdue: {
        backgroundColor: '#FFEBEE',
    },
    statusTextOverdue: {
        color: colors.error,
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    modalHeader: {
        backgroundColor: colors.primary,
        paddingTop: Platform.OS === 'ios' ? 44 : 24,
        paddingBottom: spacing.md,
        paddingHorizontal: spacing.md,
        ...shadows.sm,
    },
    modalTitle: {
        ...typography.h5,
        color: colors.onPrimary,
        textAlign: 'center',
    },
    modalSubtitle: {
        ...typography.caption,
        color: colors.primaryLight,
        textAlign: 'center',
        marginTop: spacing.xs,
    },
    modalContent: {
        flex: 1,
        padding: spacing.md,
    },
    modalActions: {
        flexDirection: 'row',
        padding: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.gray200,
        gap: spacing.sm,
    },

    // Form elements
    inputGroup: {
        marginBottom: spacing.md,
    },
    inputGroupHalf: {
        flex: 1,
        marginBottom: spacing.md,
    },
    inputLabel: {
        ...typography.subtitle2,
        color: colors.onSurface,
        marginBottom: spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        fontSize: 16,
        backgroundColor: colors.surface,
        color: colors.onSurface,
        minHeight: 44,
    },
    inputFocused: {
        borderColor: colors.primary,
        borderWidth: 2,
    },
    inputError: {
        borderColor: colors.error,
        borderWidth: 2,
    },
    inputErrorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.xs,
    },
    inputHelperText: {
        ...typography.caption,
        color: colors.gray600,
        marginTop: spacing.xs,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },

    // Invoice specific styles
    invoiceDetailsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    clientSelector: {
        marginBottom: spacing.sm,
    },
    clientOption: {
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: borderRadius.sm,
        marginRight: spacing.sm,
        minWidth: 120,
    },
    clientOptionSelected: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
    },
    clientOptionText: {
        ...typography.body2,
        color: colors.onSurface,
        fontWeight: '500',
    },
    clientOptionTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    clientOptionCompany: {
        ...typography.caption,
        color: colors.gray600,
        marginTop: spacing.xxs,
    },
    selectedClientInfo: {
        padding: spacing.sm,
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.sm,
        marginTop: spacing.xs,
    },
    selectedClientText: {
        ...typography.caption,
        color: colors.primary,
    },

    // Invoice items
    itemsSection: {
        marginBottom: spacing.md,
    },
    itemsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
        marginBottom: spacing.sm,
        backgroundColor: colors.gray50,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    itemTitle: {
        ...typography.subtitle2,
        color: colors.onSurface,
    },
    itemActions: {
        flexDirection: 'row',
        gap: spacing.xs,
    },
    itemInput: {
        flex: 1,
        marginRight: spacing.xs,
    },
    itemInputLabel: {
        ...typography.caption,
        color: colors.gray600,
        marginBottom: spacing.xs,
    },
    itemDetailsRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
    },
    itemNumberInput: {
        textAlign: 'center',
    },
    itemAmount: {
        ...typography.body1,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'right',
        paddingTop: spacing.sm,
        flex: 1,
    },
    addItemButton: {
        backgroundColor: colors.secondary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
    },
    addItemButtonText: {
        ...typography.caption,
        color: colors.white,
        fontWeight: 'bold',
    },
    duplicateItemButton: {
        backgroundColor: colors.gray400,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.sm,
    },
    duplicateItemText: {
        ...typography.caption,
        color: colors.white,
        fontSize: 10,
    },
    removeItemButton: {
        backgroundColor: colors.error,
        paddingHorizontal: spacing.xs,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.sm,
    },
    removeItemText: {
        ...typography.caption,
        color: colors.white,
        fontSize: 10,
    },

    // Totals
    totalsContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.gray300,
        paddingTop: spacing.md,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.sm,
        padding: spacing.sm,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    totalRowFinal: {
        borderTopWidth: 1,
        borderTopColor: colors.gray300,
        paddingTop: spacing.xs,
        marginTop: spacing.xs,
    },
    totalLabel: {
        ...typography.body2,
        color: colors.gray600,
    },
    totalValue: {
        ...typography.body2,
        color: colors.onSurface,
        fontWeight: '500',
    },
    totalLabelFinal: {
        ...typography.subtitle1,
        color: colors.onSurface,
        fontWeight: 'bold',
    },
    totalValueFinal: {
        ...typography.subtitle1,
        color: colors.primary,
        fontWeight: 'bold',
    },

    // Payment modal specific
    amountHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    amountInput: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: colors.primary,
    },
    fullAmountButton: {
        backgroundColor: colors.primaryLight,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.sm,
    },
    fullAmountButtonText: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: 'bold',
    },
    paymentMethodGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    paymentMethodOption: {
        flex: 1,
        minWidth: '30%',
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.gray300,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
    },
    paymentMethodOptionSelected: {
        backgroundColor: colors.primaryLight,
        borderColor: colors.primary,
    },
    paymentMethodText: {
        ...typography.caption,
        color: colors.onSurface,
    },
    paymentMethodTextSelected: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    selectedMethodText: {
        ...typography.caption,
        color: colors.gray600,
        fontStyle: 'italic',
    },
    paymentSummary: {
        backgroundColor: colors.gray50,
        padding: spacing.md,
        borderRadius: borderRadius.sm,
        marginBottom: spacing.md,
    },
    summaryTitle: {
        ...typography.subtitle2,
        color: colors.onSurface,
        marginBottom: spacing.sm,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    summaryLabel: {
        ...typography.body2,
        color: colors.gray600,
    },
    summaryValue: {
        ...typography.body2,
        color: colors.onSurface,
        fontWeight: '500',
    },

    // Action buttons
    cancelButton: {
        flex: 1,
        backgroundColor: colors.gray400,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    cancelButtonText: {
        ...typography.button,
        color: colors.white,
    },
    saveButton: {
        flex: 1,
        backgroundColor: colors.primary,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    saveButtonText: {
        ...typography.button,
        color: colors.onPrimary,
    },
    saveButtonDisabled: {
        backgroundColor: colors.gray300,
    },
    saveButtonTextDisabled: {
        color: colors.gray500,
    },

    // Empty states
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        marginTop: spacing.xl,
    },
    emptyStateText: {
        ...typography.subtitle1,
        color: colors.gray600,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    emptyStateSubtext: {
        ...typography.body2,
        color: colors.gray500,
        textAlign: 'center',
    },

    // Helper text
    helperText: {
        ...typography.caption,
        color: colors.gray500,
        textAlign: 'center',
        marginTop: spacing.md,
        fontStyle: 'italic',
    },
});

// Utility functions for dynamic styling
export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'paid':
            return colors.paid;
        case 'sent':
            return colors.sent;
        case 'overdue':
            return colors.overdue;
        case 'draft':
            return colors.draft;
        case 'cancelled':
            return colors.cancelled;
        default:
            return colors.gray500;
    }
};

export const getStatusBackgroundColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'paid':
            return colors.secondaryLight;
        case 'sent':
            return colors.accentLight;
        case 'overdue':
            return '#FFEBEE';
        case 'draft':
            return colors.gray200;
        case 'cancelled':
            return colors.gray200;
        default:
            return colors.gray100;
    }
};

export const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
    switch (priority) {
        case 'high':
            return colors.error;
        case 'medium':
            return colors.warning;
        case 'low':
            return colors.success;
        default:
            return colors.gray500;
    }
};

// Responsive breakpoints
export const breakpoints = {
    mobile: 0,
    tablet: 768,
    desktop: 1024,
    largeDesktop: 1440,
};

// Animation durations
export const animations = {
    fast: 150,
    normal: 300,
    slow: 500,
};

// Z-index values
export const zIndex = {
    modal: 1000,
    overlay: 999,
    dropdown: 500,
    header: 100,
    content: 1,
};

// Platform-specific styles
export const platformStyles = StyleSheet.create({
    // Web-specific styles
    webContainer: Platform.select({
        web: {
            maxWidth: 1200,
            marginHorizontal: 'auto',
            width: '100%',
        },
        default: {},
    }),

    // iOS-specific styles
    iosHeader: Platform.select({
        ios: {
            paddingTop: 44,
        },
        default: {},
    }),

    // Android-specific styles
    androidElevation: Platform.select({
        android: {
            elevation: 4,
        },
        default: {
            ...shadows.md,
        },
    }),

    // Shadow styles that work across platforms
    cardShadow: Platform.select({
        ios: {
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        android: {
            elevation: 3,
        },
        default: {
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
    }),
});

// Theme interface for easy theming
export interface Theme {
    colors: typeof colors;
    typography: typeof typography;
    spacing: typeof spacing;
    borderRadius: typeof borderRadius;
    shadows: typeof shadows;
}

// Default theme
export const defaultTheme: Theme = {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
};

// Dark theme colors (for future dark mode support)
export const darkColors = {
    ...colors,
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    onBackground: '#FFFFFF',
    gray50: '#1E1E1E',
    gray100: '#2D2D2D',
    gray200: '#404040',
    gray300: '#595959',
    gray400: '#737373',
    gray500: '#8C8C8C',
    gray600: '#A6A6A6',
    gray700: '#BFBFBF',
    gray800: '#D9D9D9',
    gray900: '#F2F2F2',
};

// Utility for creating responsive styles
export const createResponsiveStyle = (styles: {
    mobile?: any;
    tablet?: any;
    desktop?: any;
}) => {
    return StyleSheet.create({
        responsive: {
            ...styles.mobile,
            // Add media queries for web if needed
        },
    });
};

// Helper for creating button styles
export const createButtonStyle = (
    backgroundColor: string,
    textColor: string,
    size: 'small' | 'medium' | 'large' = 'medium'
) => {
    const sizeStyles = {
        small: {
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            minHeight: 32,
        },
        medium: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            minHeight: 44,
        },
        large: {
            paddingHorizontal: spacing.lg,
            paddingVertical: spacing.md,
            minHeight: 52,
        },
    };

    return {
        button: {
            backgroundColor,
            borderRadius: borderRadius.sm,
            alignItems: 'center' as const,
            justifyContent: 'center' as const,
            ...sizeStyles[size],
        },
        text: {
            ...typography.button,
            color: textColor,
        },
    };
};

// Helper for creating input styles with variants
export const createInputStyle = (variant: 'default' | 'error' | 'success' = 'default') => {
    const variantStyles = {
        default: {
            borderColor: colors.gray300,
        },
        error: {
            borderColor: colors.error,
            borderWidth: 2,
        },
        success: {
            borderColor: colors.success,
            borderWidth: 2,
        },
    };

    return {
        ...styles.input,
        ...variantStyles[variant],
    };
};

// Export everything for easy access
export {
    StyleSheet,
    Platform,
};

// Style constants for consistent usage
export const HEADER_HEIGHT = Platform.OS === 'ios' ? 88 : 64;
export const TAB_BAR_HEIGHT = 48;
export const MODAL_BORDER_RADIUS = borderRadius.lg;
export const CARD_BORDER_RADIUS = borderRadius.md;
export const BUTTON_BORDER_RADIUS = borderRadius.sm;