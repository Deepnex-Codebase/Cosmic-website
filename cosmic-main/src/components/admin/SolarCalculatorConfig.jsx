import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import solarConfigService from '../../services/solarConfigService';

const SolarCalculatorConfig = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Configuration data states
  const [solarBasic, setSolarBasic] = useState(null);
  
  // Dialog states
  const [stateDialog, setStateDialog] = useState(false);
  const [newState, setNewState] = useState({ name: '', tariff: 0, genPerKW_day: 0 });
  
  // Editing states
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  
  // Fetch solar basic configuration on component mount
  useEffect(() => {
    const fetchSolarBasic = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch solar basic configuration
        const solarBasicRes = await solarConfigService.getConfigByType('solarBasic');
        setSolarBasic(solarBasicRes.data);
      } catch (err) {
        console.error('Error fetching solar basic configuration:', err);
        setError('Failed to load solar basic configuration. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSolarBasic();
  }, []);
  
  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Handle edit start
  const handleEditStart = (field, value) => {
    setEditingField(field);
    setTempValue(value.toString());
  };
  
  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingField(null);
    setTempValue('');
  };
  
  // Handle edit save
  const handleEditSave = async () => {
    try {
      const newValue = isNaN(parseFloat(tempValue)) ? tempValue : parseFloat(tempValue);
      const updatedConfig = { ...solarBasic.data };
      
      // Handle nested fields
      if (editingField.includes('.')) {
        const [field, key] = editingField.split('.');
        if (!updatedConfig[field]) {
          updatedConfig[field] = {};
        }
        updatedConfig[field][key] = newValue;
      } else {
        updatedConfig[editingField] = newValue;
      }
      
      await solarConfigService.updateConfig('solarBasic', updatedConfig);
      setSolarBasic({ ...solarBasic, data: updatedConfig });
      
      setSnackbar({
        open: true,
        message: 'Solar calculator configuration updated successfully',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating configuration:', error);
      setSnackbar({
        open: true,
        message: 'Failed to update configuration',
        severity: 'error'
      });
    } finally {
      setEditingField(null);
      setTempValue('');
    }
  };
  
  // Handle state dialog open
  const handleStateDialogOpen = () => {
    setStateDialog(true);
  };
  
  // Handle state dialog close
  const handleStateDialogClose = () => {
    setStateDialog(false);
    setNewState({ name: '', tariff: 0, genPerKW_day: 0 });
  };
  
  // Handle add new state
  const handleAddState = async () => {
    try {
      const updatedConfig = { ...solarBasic.data };
      
      // Add new state to tariff and genPerKW_day
      updatedConfig.tariff[newState.name] = parseFloat(newState.tariff);
      updatedConfig.genPerKW_day[newState.name] = parseFloat(newState.genPerKW_day);
      
      await solarConfigService.updateConfig('solarBasic', updatedConfig);
      setSolarBasic({ ...solarBasic, data: updatedConfig });
      
      setSnackbar({
        open: true,
        message: `State ${newState.name} added successfully`,
        severity: 'success'
      });
      
      handleStateDialogClose();
    } catch (error) {
      console.error('Error adding new state:', error);
      setSnackbar({
        open: true,
        message: 'Failed to add new state',
        severity: 'error'
      });
    }
  };
  
  // Handle delete state
  const handleDeleteState = async (stateName) => {
    try {
      const updatedConfig = { ...solarBasic.data };
      
      // Remove state from tariff and genPerKW_day
      delete updatedConfig.tariff[stateName];
      delete updatedConfig.genPerKW_day[stateName];
      
      await solarConfigService.updateConfig('solarBasic', updatedConfig);
      setSolarBasic({ ...solarBasic, data: updatedConfig });
      
      setSnackbar({
        open: true,
        message: `State ${stateName} removed successfully`,
        severity: 'success'
      });
    } catch (error) {
      console.error('Error removing state:', error);
      setSnackbar({
        open: true,
        message: 'Failed to remove state',
        severity: 'error'
      });
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
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Solar Calculator Configuration
      </Typography>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      
      {solarBasic && solarBasic.data && (
        <Grid container spacing={3}>
          {/* Basic Parameters */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Parameters
                </Typography>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell>Value</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {['areaPerKW', 'EF', 'costPerKW'].map((field) => (
                        <TableRow key={field}>
                          <TableCell>{field}</TableCell>
                          <TableCell>
                            {editingField === field ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                type="number"
                              />
                            ) : (
                              solarBasic.data[field]
                            )}
                          </TableCell>
                          <TableCell>
                            {editingField === field ? (
                              <>
                                <IconButton onClick={handleEditSave} color="primary">
                                  <SaveIcon />
                                </IconButton>
                                <IconButton onClick={handleEditCancel} color="secondary">
                                  <CancelIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton onClick={() => handleEditStart(field, solarBasic.data[field])} color="primary">
                                <EditIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                      
                      {/* Subsidy field */}
                      <TableRow>
                        <TableCell>subsidy</TableCell>
                        <TableCell>
                          {editingField === 'subsidy' ? (
                            <TextField
                              fullWidth
                              size="small"
                              value={tempValue}
                              onChange={(e) => setTempValue(e.target.value)}
                              variant="outlined"
                              type="number"
                            />
                          ) : (
                            solarBasic.data.subsidy || 0
                          )}
                        </TableCell>
                        <TableCell>
                          {editingField === 'subsidy' ? (
                            <>
                              <IconButton onClick={handleEditSave} color="primary">
                                <SaveIcon />
                              </IconButton>
                              <IconButton onClick={handleEditCancel} color="secondary">
                                <CancelIcon />
                              </IconButton>
                            </>
                          ) : (
                            <IconButton onClick={() => handleEditStart('subsidy', solarBasic.data.subsidy || 0)} color="primary">
                              <EditIcon />
                            </IconButton>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
          
          {/* State-wise Configurations */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    State-wise Configurations
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleStateDialogOpen}
                  >
                    Add State
                  </Button>
                </Box>
                
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>State</TableCell>
                        <TableCell>Tariff (₹/kWh)</TableCell>
                        <TableCell>Generation per kW per day (kWh)</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {solarBasic.data.tariff && Object.keys(solarBasic.data.tariff).map((state) => (
                        <TableRow key={state}>
                          <TableCell>{state}</TableCell>
                          <TableCell>
                            {editingField === `tariff.${state}` ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                type="number"
                              />
                            ) : (
                              solarBasic.data.tariff[state]
                            )}
                          </TableCell>
                          <TableCell>
                            {editingField === `genPerKW_day.${state}` ? (
                              <TextField
                                fullWidth
                                size="small"
                                value={tempValue}
                                onChange={(e) => setTempValue(e.target.value)}
                                variant="outlined"
                                type="number"
                              />
                            ) : (
                              solarBasic.data.genPerKW_day[state]
                            )}
                          </TableCell>
                          <TableCell>
                            {editingField === `tariff.${state}` || editingField === `genPerKW_day.${state}` ? (
                              <>
                                <IconButton onClick={handleEditSave} color="primary">
                                  <SaveIcon />
                                </IconButton>
                                <IconButton onClick={handleEditCancel} color="secondary">
                                  <CancelIcon />
                                </IconButton>
                              </>
                            ) : (
                              <>
                                <IconButton onClick={() => handleEditStart(`tariff.${state}`, solarBasic.data.tariff[state])} color="primary">
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleEditStart(`genPerKW_day.${state}`, solarBasic.data.genPerKW_day[state])} color="primary">
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteState(state)} color="secondary">
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
      
      {/* Add State Dialog */}
      <Dialog open={stateDialog} onClose={handleStateDialogClose}>
        <DialogTitle>Add New State</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="State Name"
            fullWidth
            variant="outlined"
            value={newState.name}
            onChange={(e) => setNewState({ ...newState, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tariff (₹/kWh)"
            fullWidth
            variant="outlined"
            type="number"
            value={newState.tariff}
            onChange={(e) => setNewState({ ...newState, tariff: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Generation per kW per day (kWh)"
            fullWidth
            variant="outlined"
            type="number"
            value={newState.genPerKW_day}
            onChange={(e) => setNewState({ ...newState, genPerKW_day: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleStateDialogClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddState} color="primary" disabled={!newState.name}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SolarCalculatorConfig;