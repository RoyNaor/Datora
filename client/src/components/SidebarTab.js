import React from 'react';
import PeopleIcon from '@mui/icons-material/People';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

export const SidebarTab = [
    {
        title: "HR",
        icon: <PeopleIcon />, 
        component: "HR",
    },
    {
        title: "Sales",
        icon: <PointOfSaleIcon />, 
        component: "Sales",
    },
    {
        title: "Admin Center",
        icon: <AdminPanelSettingsIcon />,
        component: "AdminCenter",
    },
];

