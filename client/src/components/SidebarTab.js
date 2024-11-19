import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';

export const SidebarTab = [
    {
        title: "Home",
        icon: <HomeIcon />,
        component: "Home" // Dashboard component name
    },
    {
        title: "HR",
        icon: <PeopleIcon />, 
        component: "HR" // Dashboard component name
    },
    {
        title: "Finance",
        icon: <AccountBalanceIcon />, 
        component: "Finance" // Dashboard component name
    },
    {
        title: "Sales",
        icon: <PointOfSaleIcon />, 
        component: "Sales" // Dashboard component name
    },
    {
        title: "Forms",
        icon: <InsertDriveFileIcon />,
        component: "Forms" // Dashboard component name
    },
    {
        title: "Admin Center",
        icon: <AdminPanelSettingsIcon />,
        component: "AdminCenter" // Dashboard component name
    },
];
