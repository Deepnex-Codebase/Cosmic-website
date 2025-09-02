import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, CircularProgress, Container, Grid, Tab, Tabs, TextField, Typography, Alert, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import solarConfigService from '../../services/solarConfigService';

const SolarConfigCMS = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Configuration data states
  const [companyProfile, setCompanyProfile] = useState(null);
  const [solarConfig, setSolarConfig] = useState(null);
  const [solarBasic, setSolarBasic] = useState(null);
  
  // Editing states
  const [editingTariff, setEditingTariff] = useState(null);
  const [editingYield, setEditingYield] = useState(null);
  const [editingCostPerKW, setEditingCostPerKW] = useState(null);
  const [editingSubsidy, setEditingSubsidy] = useState(null);
  const [editingOtherConfig, setEditingOtherConfig] = useState(null);
  const [editingCompanyProfile, setEditingCompanyProfile] = useState(null);
  
  // Temporary values for editing
  const [tempValue, setTempValue] = useState('');
  const [tempNestedValue, setTempNestedValue] = useState('');
  
  // Fetch all configurations on component mount
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all configurations
        const companyProfileRes = await solarConfigService.getConfigByType('companyProfile');
        const solarConfigRes = await solarConfigService.getConfigByType('solarConfig');
        const solarBasicRes = await solarConfigService.getConfigByType('solarBasic');
        
        setCompanyProfile(companyProfileRes.data);
        setSolarConfig(solarConfigRes.data);
        setSolarBasic(solarBasicRes.data);
      } catch (err) {
        console.error('Error fetching configurations:', err);
        setError('Failed to load configurations. Please try again.');
        
        // If configurations don't exist, try to initialize them
        try {
          await solarConfigService.initializeConfigs();
          setSnackbar({
            open: true,
            message: 'Configurations initialized successfully. Please refresh the page.',
            severity: 'info'
          });
        } catch (initError) {
          console.error('Error initializing configurations:', initError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchConfigs();
  }, []);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle edit start
  const handleEditStart = (type, key, value) => {
    setTempValue(value.toString());
    
    switch(type) {
      case 'tariff':
        setEditingTariff(key);
        break;
      case 'yield':
        setEditingYield(key);
        break;
      case 'costPerKW':
        setEditingCostPerKW(key);
        break;
      case 'subsidy':
        setEditingSubsidy(key);
        break;
      case 'otherConfig':
        setEditingOtherConfig(key);
        break;
      default:
        break;
    }
  };
  
  // Handle edit cancel
  const handleEditCancel = (type) => {
    switch(type) {
      case 'tariff':
        setEditingTariff(null);
        break;
      case 'yield':
        setEditingYield(null);
        break;
      case 'costPerKW':
        setEditingCostPerKW(null);
        break;
      case 'subsidy':
        setEditingSubsidy(null);
        break;
      case 'otherConfig':
        setEditingOtherConfig(null);
        break;
      default:
        break;
    }
    setTempValue('');
  };
  
  // Handle edit save
  const handleEditSave = async (type, key) => {
    try {
      const newValue = Number(tempValue) || tempValue;
      
      if (type.startsWith('solar_basic')) {
        // Handle solar basic config updates
        const updatedBasicConfig = JSON.parse(JSON.stringify(solarBasic.data));
        const actualKey = key;
        
        updatedBasicConfig[actualKey] = newValue;
        await solarConfigService.updateConfig('solarBasic', updatedBasicConfig);
        setSolarBasic({ ...solarBasic, data: updatedBasicConfig });
        
        setSnackbar({
          open: true,
          message: 'Solar basic configuration updated successfully',
          severity: 'success'
        });
      } else if (type.startsWith('company_profile')) {
        // Handle company profile updates
        const updatedCompanyProfile = JSON.parse(JSON.stringify(companyProfile.data));
        
        // Handle nested paths like company.name or offerings.residential.title
        const pathParts = key.split('.');
        
        if (pathParts.length === 1) {
          // Top level property
          updatedCompanyProfile[pathParts[0]] = newValue;
        } else if (pathParts.length === 2) {
          // Two levels deep
          if (!updatedCompanyProfile[pathParts[0]]) {
            updatedCompanyProfile[pathParts[0]] = {};
          }
          updatedCompanyProfile[pathParts[0]][pathParts[1]] = newValue;
        } else if (pathParts.length === 3) {
          // Three levels deep
          if (!updatedCompanyProfile[pathParts[0]]) {
            updatedCompanyProfile[pathParts[0]] = {};
          }
          if (!updatedCompanyProfile[pathParts[0]][pathParts[1]]) {
            updatedCompanyProfile[pathParts[0]][pathParts[1]] = {};
          }
          updatedCompanyProfile[pathParts[0]][pathParts[1]][pathParts[2]] = newValue;
        } else if (pathParts.length === 4) {
          // Four levels deep
          if (!updatedCompanyProfile[pathParts[0]]) {
            updatedCompanyProfile[pathParts[0]] = {};
          }
          if (!updatedCompanyProfile[pathParts[0]][pathParts[1]]) {
            updatedCompanyProfile[pathParts[0]][pathParts[1]] = {};
          }
          if (!updatedCompanyProfile[pathParts[0]][pathParts[1]][pathParts[2]]) {
            updatedCompanyProfile[pathParts[0]][pathParts[1]][pathParts[2]] = {};
          }
          updatedCompanyProfile[pathParts[0]][pathParts[1]][pathParts[2]][pathParts[3]] = newValue;
        }
        
        await solarConfigService.updateConfig('companyProfile', updatedCompanyProfile);
        setCompanyProfile({ ...companyProfile, data: updatedCompanyProfile });
        setEditingCompanyProfile(null);
        
        setSnackbar({
          open: true,
          message: 'Company profile updated successfully',
          severity: 'success'
        });
      } else {
        // Handle solar config updates
        const updatedConfig = JSON.parse(JSON.stringify(solarConfig.data));
        
        switch(type) {
          case 'tariff':
            updatedConfig.configuration.tariff[key] = newValue;
            setEditingTariff(null);
            break;
          case 'yield':
            updatedConfig.configuration.yield[key] = newValue;
            setEditingYield(null);
            break;
          case 'costPerKW':
            updatedConfig.configuration.costPerKW[key] = newValue;
            setEditingCostPerKW(null);
            break;
          case 'subsidy':
            updatedConfig.configuration.subsidy[key] = newValue;
            setEditingSubsidy(null);
            break;
          case 'otherConfig':
            if (key.includes('loan.')) {
              const loanKey = key.split('.')[1];
              updatedConfig.configuration.loan[loanKey] = newValue;
            } else {
              updatedConfig.configuration[key] = newValue;
            }
            setEditingOtherConfig(null);
            break;
          default:
            break;
        }
        
        await solarConfigService.updateConfig('solarConfig', updatedConfig);
        setSolarConfig({ ...solarConfig, data: updatedConfig });
        
        setSnackbar({
          open: true,
          message: 'Solar configuration updated successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update configuration',
        severity: 'error'
      });
    } finally {
      setTempValue('');
      setTempNestedValue('');
    }
  };
  
  // Handle company profile edit start
  const handleCompanyProfileEditStart = (path, value) => {
    setEditingCompanyProfile(path);
    setTempValue(value.toString());
  };
  
  // Handle company profile edit cancel
  const handleCompanyProfileEditCancel = () => {
    setEditingCompanyProfile(null);
    setTempValue('');
  };
  
  // Company Profile Form
  const companyProfileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      companyData: companyProfile ? JSON.stringify(companyProfile.data, null, 2) : '{}'
    },
    validationSchema: Yup.object({
      companyData: Yup.string()
        .required('Company profile data is required')
        .test('is-valid-json', 'Invalid JSON format', (value) => {
          try {
            JSON.parse(value);
            return true;
          } catch (error) {
            return false;
          }
        })
    }),
    onSubmit: async (values) => {
      try {
        const parsedData = JSON.parse(values.companyData);
        await solarConfigService.updateConfig('companyProfile', parsedData);
        
        setSnackbar({
          open: true,
          message: 'Company profile updated successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error updating company profile:', error);
        setSnackbar({
          open: true,
          message: 'Failed to update company profile',
          severity: 'error'
        });
      }
    }
  });
  
  // Solar Config Form
  const solarConfigFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      configData: solarConfig ? JSON.stringify(solarConfig.data, null, 2) : '{}'
    },
    validationSchema: Yup.object({
      configData: Yup.string()
        .required('Solar configuration data is required')
        .test('is-valid-json', 'Invalid JSON format', (value) => {
          try {
            JSON.parse(value);
            return true;
          } catch (error) {
            return false;
          }
        })
    }),
    onSubmit: async (values) => {
      try {
        const parsedData = JSON.parse(values.configData);
        await solarConfigService.updateConfig('solarConfig', parsedData);
        
        setSnackbar({
          open: true,
          message: 'Solar configuration updated successfully',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error updating solar configuration:', error);
        setSnackbar({
          open: true,
          message: 'Failed to update solar configuration',
          severity: 'error'
        });
      }
    }
  });
  
  // State for editing Solar Basic fields
  const [editingSolarBasic, setEditingSolarBasic] = useState(null);
  
  // Handle edit start for Solar Basic
  const handleSolarBasicEditStart = (key, value) => {
    setEditingSolarBasic(key);
    setTempValue(value.toString());
  };
  
  // Handle edit cancel for Solar Basic
  const handleSolarBasicEditCancel = () => {
    setEditingSolarBasic(null);
    setTempValue('');
  };
  
  // Handle edit save for Solar Basic
  const handleSolarBasicEditSave = async (key) => {
    try {
      const newValue = Number(tempValue) || tempValue;
      const updatedBasicConfig = JSON.parse(JSON.stringify(solarBasic.data));
      
      updatedBasicConfig[key] = newValue;
      
      await solarConfigService.updateConfig('solarBasic', updatedBasicConfig);
      setSolarBasic({ ...solarBasic, data: updatedBasicConfig });
      
      setSnackbar({
        open: true,
        message: 'Solar basic configuration updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating solar basic configuration:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update solar basic configuration',
        severity: 'error'
      });
    } finally {
      setEditingSolarBasic(null);
      setTempValue('');
    }
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  
  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Company Profile" />
          <Tab label="Solar Config" />
          <Tab label="Solar Basic" />
        </Tabs>
      </Box>
      
      {/* Company Profile Tab */}
      {activeTab === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Company Profile
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This configuration contains company information, offerings, subsidy details, and more.
            </Typography>
            
            {companyProfile && companyProfile.data && (
              <>
                {/* Company Information */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Company Information
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.company && Object.entries(companyProfile.data.company).map(([key, value]) => {
                        // Skip nested objects and arrays for separate tables
                        if (typeof value === 'object') return null;
                        
                        return (
                          <TableRow key={`company.${key}`}>
                            <TableCell>{key}</TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.${key}` ? (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  variant="outlined"
                                />
                              ) : (
                                typeof value === 'object' && value !== null ? 
                                JSON.stringify(value) : 
                                value
                              )}
                            </TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.${key}` ? (
                                <>
                                  <IconButton onClick={() => handleEditSave('company_profile', `company.${key}`)} color="primary">
                                    <SaveIcon />
                                  </IconButton>
                                  <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton onClick={() => handleCompanyProfileEditStart(`company.${key}`, value)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Company Contact Information */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Contact Information
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.company && companyProfile.data.company.contact && 
                        Object.entries(companyProfile.data.company.contact).map(([key, value]) => (
                          <TableRow key={`company.contact.${key}`}>
                            <TableCell>{key}</TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.contact.${key}` ? (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  variant="outlined"
                                />
                              ) : (
                                typeof value === 'object' && value !== null ? 
                                JSON.stringify(value) : 
                                value
                              )}
                            </TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.contact.${key}` ? (
                                <>
                                  <IconButton onClick={() => handleEditSave('company_profile', `company.contact.${key}`)} color="primary">
                                    <SaveIcon />
                                  </IconButton>
                                  <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton onClick={() => handleCompanyProfileEditStart(`company.contact.${key}`, value)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Service Areas */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Service Areas
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Area</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.company && companyProfile.data.company.serviceAreas && 
                        companyProfile.data.company.serviceAreas.map((area, index) => (
                          <TableRow key={`company.serviceAreas.${index}`}>
                            <TableCell>{index}</TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.serviceAreas.${index}` ? (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  variant="outlined"
                                />
                              ) : (
                                area
                              )}
                            </TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.serviceAreas.${index}` ? (
                                <>
                                  <IconButton onClick={() => handleEditSave('company_profile', `company.serviceAreas.${index}`)} color="primary">
                                    <SaveIcon />
                                  </IconButton>
                                  <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton onClick={() => handleCompanyProfileEditStart(`company.serviceAreas.${index}`, area)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Certifications */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Certifications
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Index</TableCell>
                        <TableCell>Certification</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.company && companyProfile.data.company.certifications && 
                        companyProfile.data.company.certifications.map((cert, index) => (
                          <TableRow key={`company.certifications.${index}`}>
                            <TableCell>{index}</TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.certifications.${index}` ? (
                                <TextField
                                  fullWidth
                                  size="small"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  variant="outlined"
                                />
                              ) : (
                                cert
                              )}
                            </TableCell>
                            <TableCell>
                              {editingCompanyProfile === `company.certifications.${index}` ? (
                                <>
                                  <IconButton onClick={() => handleEditSave('company_profile', `company.certifications.${index}`)} color="primary">
                                    <SaveIcon />
                                  </IconButton>
                                  <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                    <CancelIcon />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton onClick={() => handleCompanyProfileEditStart(`company.certifications.${index}`, cert)} color="primary">
                                  <EditIcon />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Offerings */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Offerings
                </Typography>
                
                {/* Residential Offerings */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Residential
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.offerings && companyProfile.data.offerings.residential && 
                        Object.entries(companyProfile.data.offerings.residential).map(([key, value]) => {
                          // Skip nested objects and arrays for separate tables
                          if (typeof value === 'object' && !Array.isArray(value)) return null;
                          if (Array.isArray(value)) return null;
                          
                          return (
                            <TableRow key={`offerings.residential.${key}`}>
                              <TableCell>{key}</TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.residential.${key}` ? (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    variant="outlined"
                                  />
                                ) : (
                                  typeof value === 'object' && value !== null ? 
                                  JSON.stringify(value) : 
                                  value
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.residential.${key}` ? (
                                  <>
                                    <IconButton onClick={() => handleEditSave('company_profile', `offerings.residential.${key}`)} color="primary">
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton onClick={() => handleCompanyProfileEditStart(`offerings.residential.${key}`, value)} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Commercial Offerings */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Commercial
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.offerings && companyProfile.data.offerings.commercial && 
                        Object.entries(companyProfile.data.offerings.commercial).map(([key, value]) => {
                          // Skip nested objects and arrays for separate tables
                          if (typeof value === 'object' && !Array.isArray(value)) return null;
                          if (Array.isArray(value)) return null;
                          
                          return (
                            <TableRow key={`offerings.commercial.${key}`}>
                              <TableCell>{key}</TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.commercial.${key}` ? (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    variant="outlined"
                                  />
                                ) : (
                                  typeof value === 'object' && value !== null ? 
                                  JSON.stringify(value) : 
                                  value
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.commercial.${key}` ? (
                                  <>
                                    <IconButton onClick={() => handleEditSave('company_profile', `offerings.commercial.${key}`)} color="primary">
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton onClick={() => handleCompanyProfileEditStart(`offerings.commercial.${key}`, value)} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Society Offerings */}
                <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
                  Society
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Field</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {companyProfile.data.offerings && companyProfile.data.offerings.society && 
                        Object.entries(companyProfile.data.offerings.society).map(([key, value]) => {
                          // Skip nested objects and arrays for separate tables
                          if (typeof value === 'object' && !Array.isArray(value)) return null;
                          if (Array.isArray(value)) return null;
                          
                          return (
                            <TableRow key={`offerings.society.${key}`}>
                              <TableCell>{key}</TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.society.${key}` ? (
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={tempValue}
                                    onChange={(e) => setTempValue(e.target.value)}
                                    variant="outlined"
                                  />
                                ) : (
                                  typeof value === 'object' && value !== null ? 
                                  JSON.stringify(value) : 
                                  value
                                )}
                              </TableCell>
                              <TableCell>
                                {editingCompanyProfile === `offerings.society.${key}` ? (
                                  <>
                                    <IconButton onClick={() => handleEditSave('company_profile', `offerings.society.${key}`)} color="primary">
                                      <SaveIcon />
                                    </IconButton>
                                    <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                      <CancelIcon />
                                    </IconButton>
                                  </>
                                ) : (
                                  <IconButton onClick={() => handleCompanyProfileEditStart(`offerings.society.${key}`, value)} color="primary">
                                    <EditIcon />
                                  </IconButton>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      }
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Why Choose Us Section */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  Why Choose Us
                </Typography>
                {companyProfile.data.whyChooseUs && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Reasons</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Index</TableCell>
                              <TableCell>Title</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {companyProfile.data.whyChooseUs.reasons && 
                              companyProfile.data.whyChooseUs.reasons.map((reason, index) => (
                                <TableRow key={`whyChooseUs.reasons.${index}`}>
                                  <TableCell>{index}</TableCell>
                                  <TableCell>
                                    {editingCompanyProfile === `whyChooseUs.reasons.${index}.title` ? (
                                      <TextField
                                        fullWidth
                                        size="small"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        variant="outlined"
                                      />
                                    ) : (
                                      reason.title
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingCompanyProfile === `whyChooseUs.reasons.${index}.description` ? (
                                      <TextField
                                        fullWidth
                                        multiline
                                        size="small"
                                        value={tempValue}
                                        onChange={(e) => setTempValue(e.target.value)}
                                        variant="outlined"
                                      />
                                    ) : (
                                      reason.description
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {editingCompanyProfile === `whyChooseUs.reasons.${index}.title` || 
                                     editingCompanyProfile === `whyChooseUs.reasons.${index}.description` ? (
                                      <>
                                        <IconButton 
                                          onClick={() => handleEditSave('company_profile', editingCompanyProfile)} 
                                          color="primary"
                                        >
                                          <SaveIcon />
                                        </IconButton>
                                        <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                          <CancelIcon />
                                        </IconButton>
                                      </>
                                    ) : (
                                      <>
                                        <IconButton 
                                          onClick={() => handleCompanyProfileEditStart(`whyChooseUs.reasons.${index}.title`, reason.title)} 
                                          color="primary"
                                        >
                                          <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                          onClick={() => handleCompanyProfileEditStart(`whyChooseUs.reasons.${index}.description`, reason.description)} 
                                          color="secondary"
                                        >
                                          <EditIcon />
                                        </IconButton>
                                      </>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}
                
                {/* FAQ Section */}
                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                  FAQs
                </Typography>
                {companyProfile.data.faqs && (
                  <Accordion defaultExpanded>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>Frequently Asked Questions</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Index</TableCell>
                              <TableCell>Question</TableCell>
                              <TableCell>Answer</TableCell>
                              <TableCell>Actions</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {companyProfile.data.faqs.map((faq, index) => (
                              <TableRow key={`faqs.${index}`}>
                                <TableCell>{index}</TableCell>
                                <TableCell>
                                  {editingCompanyProfile === `faqs.${index}.question` ? (
                                    <TextField
                                      fullWidth
                                      size="small"
                                      value={tempValue}
                                      onChange={(e) => setTempValue(e.target.value)}
                                      variant="outlined"
                                    />
                                  ) : (
                                    faq.question
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingCompanyProfile === `faqs.${index}.answer` ? (
                                    <TextField
                                      fullWidth
                                      multiline
                                      size="small"
                                      value={tempValue}
                                      onChange={(e) => setTempValue(e.target.value)}
                                      variant="outlined"
                                    />
                                  ) : (
                                    faq.answer
                                  )}
                                </TableCell>
                                <TableCell>
                                  {editingCompanyProfile === `faqs.${index}.question` || 
                                   editingCompanyProfile === `faqs.${index}.answer` ? (
                                    <>
                                      <IconButton 
                                        onClick={() => handleEditSave('company_profile', editingCompanyProfile)} 
                                        color="primary"
                                      >
                                        <SaveIcon />
                                      </IconButton>
                                      <IconButton onClick={handleCompanyProfileEditCancel} color="secondary">
                                        <CancelIcon />
                                      </IconButton>
                                    </>
                                  ) : (
                                    <>
                                      <IconButton 
                                        onClick={() => handleCompanyProfileEditStart(`faqs.${index}.question`, faq.question)} 
                                        color="primary"
                                      >
                                        <EditIcon />
                                      </IconButton>
                                      <IconButton 
                                        onClick={() => handleCompanyProfileEditStart(`faqs.${index}.answer`, faq.answer)} 
                                        color="secondary"
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Solar Config Tab */}
      {activeTab === 1 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Solar Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This configuration contains detailed solar calculator settings, tariffs, yields, and more.
            </Typography>
            
            {solarConfig && (
              <Box sx={{ mt: 3 }}>
                {/* Tariff Table */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Tariff Configuration (₹/kWh)
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>State/Region</TableCell>
                        <TableCell align="right">Tariff Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration.tariff).map(([state, value]) => (
                        <TableRow key={`tariff-${state}`}>
                          <TableCell>{state}</TableCell>
                          <TableCell align="right">
                            {editingTariff === state ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type="number"
                                inputProps={{ step: 0.01 }}
                              />
                            ) : (
                              typeof value === 'object' && value !== null ? 
                              JSON.stringify(value) : 
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingTariff === state ? (
                              <>
                                <IconButton color="primary" onClick={() => handleEditSave('tariff', state)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEditCancel('tariff')}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleEditStart('tariff', state, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Yield Table */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Yield Configuration (kWh/kWp/year)
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>State/Region</TableCell>
                        <TableCell align="right">Yield Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration.yield).map(([state, value]) => (
                        <TableRow key={`yield-${state}`}>
                          <TableCell>{state}</TableCell>
                          <TableCell align="right">
                            {editingYield === state ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type="number"
                              />
                            ) : (
                              typeof value === 'object' && value !== null ? 
                              JSON.stringify(value) : 
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingYield === state ? (
                              <>
                                <IconButton color="primary" onClick={() => handleEditSave('yield', state)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEditCancel('yield')}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleEditStart('yield', state, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Cost Per KW Table */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Cost Per KW Configuration (₹)
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>System Size Range</TableCell>
                        <TableCell align="right">Cost Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration.costPerKW).map(([range, value]) => (
                        <TableRow key={`cost-${range}`}>
                          <TableCell>{range}</TableCell>
                          <TableCell align="right">
                            {editingCostPerKW === range ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type="number"
                              />
                            ) : (
                              typeof value === 'object' && value !== null ? 
                              JSON.stringify(value) : 
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingCostPerKW === range ? (
                              <>
                                <IconButton color="primary" onClick={() => handleEditSave('costPerKW', range)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEditCancel('costPerKW')}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleEditStart('costPerKW', range, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Subsidy Table */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Subsidy Configuration (₹)
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>System Size Range</TableCell>
                        <TableCell align="right">Subsidy Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration.subsidy).map(([range, value]) => (
                        <TableRow key={`subsidy-${range}`}>
                          <TableCell>{range}</TableCell>
                          <TableCell align="right">
                            {editingSubsidy === range ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type="number"
                              />
                            ) : (
                              typeof value === 'object' && value !== null ? 
                              JSON.stringify(value) : 
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingSubsidy === range ? (
                              <>
                                <IconButton color="primary" onClick={() => handleEditSave('subsidy', range)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEditCancel('subsidy')}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleEditStart('subsidy', range, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Other Configuration */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Other Configuration Parameters
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration)
                        .filter(([key]) => !['tariff', 'yield', 'costPerKW', 'subsidy', 'loan'].includes(key))
                        .map(([key, value]) => (
                          <TableRow key={`other-${key}`}>
                            <TableCell>{key}</TableCell>
                            <TableCell align="right">
                              {editingOtherConfig === key ? (
                                <TextField
                                  size="small"
                                  value={tempValue}
                                  onChange={(e) => setTempValue(e.target.value)}
                                  variant="outlined"
                                  fullWidth
                                  type={typeof value === 'number' ? 'number' : 'text'}
                                  inputProps={typeof value === 'number' ? { step: 0.001 } : {}}
                                />
                              ) : (
                                typeof value === 'object' && value !== null ? 
                                JSON.stringify(value) : 
                                value
                              )}
                            </TableCell>
                            <TableCell align="center">
                              {editingOtherConfig === key ? (
                                <>
                                  <IconButton color="primary" onClick={() => handleEditSave('otherConfig', key)}>
                                    <SaveIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton color="error" onClick={() => handleEditCancel('otherConfig')}>
                                    <CancelIcon fontSize="small" />
                                  </IconButton>
                                </>
                              ) : (
                                <IconButton color="primary" onClick={() => handleEditStart('otherConfig', key, value)}>
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                {/* Loan Configuration */}
                <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                  Loan Configuration
                </Typography>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarConfig.data.configuration.loan).map(([key, value]) => (
                        <TableRow key={`loan-${key}`}>
                          <TableCell>{key}</TableCell>
                          <TableCell align="right">
                            {editingOtherConfig === `loan.${key}` ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type="number"
                                inputProps={{ step: 0.01 }}
                              />
                            ) : (
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingOtherConfig === `loan.${key}` ? (
                              <>
                                <IconButton color="primary" onClick={() => handleEditSave('otherConfig', `loan.${key}`)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleEditCancel('otherConfig')}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleEditStart('otherConfig', `loan.${key}`, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Solar Basic Tab */}
      {activeTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Edit Solar Basic Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              This configuration contains basic solar parameters like tariffs, area per kW, and generation values.
            </Typography>
            
            {solarBasic && (
              <Box sx={{ mt: 3 }}>
                <TableContainer component={Paper} sx={{ mb: 4 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(solarBasic.data).map(([key, value]) => (
                        <TableRow key={`solar-basic-${key}`}>
                          <TableCell>{key}</TableCell>
                          <TableCell align="right">
                            {editingSolarBasic === key ? (
                              <TextField
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                fullWidth
                                type={typeof value === 'number' ? "number" : "text"}
                                inputProps={typeof value === 'number' ? { step: 0.01 } : {}}
                              />
                            ) : (
                              typeof value === 'object' && value !== null ? 
                              JSON.stringify(value) : 
                              value
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {editingSolarBasic === key ? (
                              <>
                                <IconButton color="primary" onClick={() => handleSolarBasicEditSave(key)}>
                                  <SaveIcon fontSize="small" />
                                </IconButton>
                                <IconButton color="error" onClick={() => handleSolarBasicEditCancel()}>
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton color="primary" onClick={() => handleSolarBasicEditStart(key, value)}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SolarConfigCMS;