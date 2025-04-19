import { useState, useEffect } from 'react';
import { API_ENDPOINTS, fetchWithAuth } from '@/constants/apiEndpoints';

export const usePortfolio = (email) => {
  const [portfolioData, setPortfolioData] = useState({
    userDetails: null,
    toolNames: [],
    tools: [],
    toolComponents: [],
    education: [],
    certificates: [],
    projects: [],
    links: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details
  const fetchUserDetails = async () => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.USER_DETAILS(email));
      setPortfolioData(prev => ({ ...prev, userDetails: data }));
      return data;
    } catch (err) {
      setError('Failed to fetch user details');
      console.error(err);
      throw err;
    }
  };

  // Update user details
  const updateUserDetails = async (updatedData) => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_DETAILS(email), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error('Failed to update portfolio');
      }

      const data = await response.json();
      setPortfolioData(prev => ({ ...prev, userDetails: data }));
      return data;
    } catch (err) {
      console.error('Failed to update user details:', err);
      throw err;
    }
  };

  // Education operations
  const fetchEducation = async () => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.EDUCATION}?user=${portfolioData.userDetails?.id}`);
      setPortfolioData(prev => ({ ...prev, education: data }));
      return data;
    } catch (err) {
      setError('Failed to fetch education data');
      console.error(err);
      throw err;
    }
  };

  const addEducation = async (educationData) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.EDUCATION, {
        method: 'POST',
        body: JSON.stringify({
          ...educationData,
          user: portfolioData.userDetails.id,
        }),
      });
      setPortfolioData(prev => ({
        ...prev,
        education: [...prev.education, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to add education');
      throw err;
    }
  };

  const updateEducation = async (id, educationData) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.EDUCATION}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(educationData),
      });
      setPortfolioData(prev => ({
        ...prev,
        education: prev.education.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update education');
      throw err;
    }
  };

  const deleteEducation = async (id) => {
    try {
      await fetchWithAuth(`${API_ENDPOINTS.EDUCATION}${id}/`, {
        method: 'DELETE',
      });
      setPortfolioData(prev => ({
        ...prev,
        education: prev.education.filter(item => item.id !== id),
      }));
      return true;
    } catch (err) {
      setError('Failed to delete education');
      throw err;
    }
  };

  // Certificate operations
  const fetchCertificates = async () => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.CERTIFICATES}?user=${portfolioData.userDetails?.id}`);
      setPortfolioData(prev => ({ ...prev, certificates: data }));
      return data;
    } catch (err) {
      setError('Failed to fetch certificates');
      console.error(err);
      throw err;
    }
  };

  const addCertificate = async (certificateData) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.CERTIFICATES, {
        method: 'POST',
        body: JSON.stringify({
          ...certificateData,
          user: portfolioData.userDetails.id,
        }),
      });
      setPortfolioData(prev => ({
        ...prev,
        certificates: [...prev.certificates, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to add certificate');
      throw err;
    }
  };

  const updateCertificate = async (id, certificateData) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.CERTIFICATES}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(certificateData),
      });
      setPortfolioData(prev => ({
        ...prev,
        certificates: prev.certificates.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update certificate');
      throw err;
    }
  };

  const deleteCertificate = async (id) => {
    try {
      await fetchWithAuth(`${API_ENDPOINTS.CERTIFICATES}${id}/`, {
        method: 'DELETE',
      });
      setPortfolioData(prev => ({
        ...prev,
        certificates: prev.certificates.filter(item => item.id !== id),
      }));
      return true;
    } catch (err) {
      setError('Failed to delete certificate');
      throw err;
    }
  };

  // Project operations
  const fetchProjects = async () => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.PROJECTS}?user=${portfolioData.userDetails?.id}`);
      setPortfolioData(prev => ({ ...prev, projects: data }));
      
      // Fetch links for each project
      let allLinks = [];
      for (const project of data) {
        const links = await fetchWithAuth(`${API_ENDPOINTS.LINKS}?project=${project.id}`);
        allLinks = [...allLinks, ...links];
      }
      setPortfolioData(prev => ({ ...prev, links: allLinks }));
      
      return data;
    } catch (err) {
      setError('Failed to fetch projects');
      console.error(err);
      throw err;
    }
  };

  const addProject = async (projectData) => {
    try {
      // First save the project
      const data = await fetchWithAuth(API_ENDPOINTS.PROJECTS, {
        method: 'POST',
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
          user: portfolioData.userDetails.id,
        }),
      });
      
      // Add to state
      setPortfolioData(prev => ({
        ...prev,
        projects: [...prev.projects, data],
      }));
      
      // If there are links, save them
      const savedLinks = [];
      if (projectData.links && projectData.links.length > 0) {
        for (const link of projectData.links) {
          const linkData = await addProjectLink({
            ...link,
            project: data.id
          });
          savedLinks.push(linkData);
        }
      }
      
      return { ...data, links: savedLinks };
    } catch (err) {
      setError('Failed to add project');
      throw err;
    }
  };

  const updateProject = async (id, projectData) => {
    try {
      // Update project data
      const data = await fetchWithAuth(`${API_ENDPOINTS.PROJECTS}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: projectData.name,
          description: projectData.description,
        }),
      });
      
      setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.map(item => 
          item.id === id ? data : item
        ),
      }));
      
      // Handle links if they exist
      if (projectData.links) {
        // Delete existing links
        const existingLinks = portfolioData.links.filter(link => link.project === id);
        for (const link of existingLinks) {
          await deleteProjectLink(link.id);
        }
        
        // Add new links
        for (const link of projectData.links) {
          await addProjectLink({
            name: link.name,
            url: link.url,
            project: id
          });
        }
      }
      
      return data;
    } catch (err) {
      setError('Failed to update project');
      throw err;
    }
  };

  const deleteProject = async (id) => {
    try {
      // Delete all associated links first
      const projectLinks = portfolioData.links.filter(link => link.project === id);
      for (const link of projectLinks) {
        await deleteProjectLink(link.id);
      }
      
      // Then delete the project
      await fetchWithAuth(`${API_ENDPOINTS.PROJECTS}${id}/`, {
        method: 'DELETE',
      });
      
      setPortfolioData(prev => ({
        ...prev,
        projects: prev.projects.filter(item => item.id !== id),
      }));
      
      return true;
    } catch (err) {
      setError('Failed to delete project');
      throw err;
    }
  };

  // Project link operations
  const addProjectLink = async (linkData) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.LINKS, {
        method: 'POST',
        body: JSON.stringify(linkData),
      });
      setPortfolioData(prev => ({
        ...prev,
        links: [...prev.links, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to add project link');
      throw err;
    }
  };

  const updateProjectLink = async (id, linkData) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.LINKS}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(linkData),
      });
      setPortfolioData(prev => ({
        ...prev,
        links: prev.links.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update project link');
      throw err;
    }
  };

  const deleteProjectLink = async (id) => {
    try {
      await fetchWithAuth(`${API_ENDPOINTS.LINKS}${id}/`, {
        method: 'DELETE',
      });
      setPortfolioData(prev => ({
        ...prev,
        links: prev.links.filter(item => item.id !== id),
      }));
      return true;
    } catch (err) {
      setError('Failed to delete project link');
      throw err;
    }
  };

  // Tool operations
  const fetchToolNames = async () => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.TOOL_NAMES}?user=${portfolioData.userDetails?.id}`);
      setPortfolioData(prev => ({ ...prev, toolNames: data }));
      return data;
    } catch (err) {
      setError('Failed to fetch tool names');
      console.error(err);
      throw err;
    }
  };

  const fetchToolsAndComponents = async () => {
    try {
      // First get all tool names
      const toolNames = await fetchToolNames();
      
      // Then fetch tools for each tool name
      let allTools = [];
      let allComponents = [];
      
      for (const toolName of toolNames) {
        const tools = await fetchWithAuth(`${API_ENDPOINTS.TOOLS}?tool_name=${toolName.id}`);
        allTools = [...allTools, ...tools];
        
        // Fetch components for each tool
        for (const tool of tools) {
          const components = await fetchWithAuth(`${API_ENDPOINTS.TOOL_COMPONENTS}?tool=${tool.id}`);
          allComponents = [...allComponents, ...components];
        }
      }
      
      setPortfolioData(prev => ({
        ...prev,
        tools: allTools,
        toolComponents: allComponents,
      }));
      
      return { toolNames, tools: allTools, components: allComponents };
    } catch (err) {
      setError('Failed to fetch tools data');
      console.error(err);
      throw err;
    }
  };

  // Create tool name (category)
  const createToolName = async (name) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.TOOL_NAMES, {
        method: 'POST',
        body: JSON.stringify({ name, user: portfolioData.userDetails.id }),
      });
      setPortfolioData(prev => ({
        ...prev,
        toolNames: [...prev.toolNames, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to create tool category');
      throw err;
    }
  };

  // Update tool name
  const updateToolName = async (id, name) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.TOOL_NAMES}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      setPortfolioData(prev => ({
        ...prev,
        toolNames: prev.toolNames.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update tool category');
      throw err;
    }
  };

  // Delete tool name
  const deleteToolName = async (id) => {
    try {
      // First delete all associated tools
      const toolsToDelete = portfolioData.tools.filter(tool => tool.tool_name === id);
      for (const tool of toolsToDelete) {
        await deleteTool(tool.id);
      }
      
      // Then delete the tool name
      await fetchWithAuth(`${API_ENDPOINTS.TOOL_NAMES}${id}/`, {
        method: 'DELETE',
      });
      
      setPortfolioData(prev => ({
        ...prev,
        toolNames: prev.toolNames.filter(item => item.id !== id),
      }));
      
      return true;
    } catch (err) {
      setError('Failed to delete tool category');
      throw err;
    }
  };

  // Create tool
  const createTool = async (name, toolNameId) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.TOOLS, {
        method: 'POST',
        body: JSON.stringify({ name, tool_name: toolNameId }),
      });
      setPortfolioData(prev => ({
        ...prev,
        tools: [...prev.tools, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to create tool');
      throw err;
    }
  };

  // Update tool
  const updateTool = async (id, name) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.TOOLS}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      setPortfolioData(prev => ({
        ...prev,
        tools: prev.tools.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update tool');
      throw err;
    }
  };

  // Delete tool
  const deleteTool = async (id) => {
    try {
      // First delete all associated components
      const componentsToDelete = portfolioData.toolComponents.filter(component => component.tool === id);
      for (const component of componentsToDelete) {
        await deleteToolComponent(component.id);
      }
      
      // Then delete the tool
      await fetchWithAuth(`${API_ENDPOINTS.TOOLS}${id}/`, {
        method: 'DELETE',
      });
      
      setPortfolioData(prev => ({
        ...prev,
        tools: prev.tools.filter(item => item.id !== id),
      }));
      
      return true;
    } catch (err) {
      setError('Failed to delete tool');
      throw err;
    }
  };

  // Create tool component
  const createToolComponent = async (name, toolId) => {
    try {
      const data = await fetchWithAuth(API_ENDPOINTS.TOOL_COMPONENTS, {
        method: 'POST',
        body: JSON.stringify({ name, tool: toolId }),
      });
      setPortfolioData(prev => ({
        ...prev,
        toolComponents: [...prev.toolComponents, data],
      }));
      return data;
    } catch (err) {
      setError('Failed to create tool component');
      throw err;
    }
  };

  // Update tool component
  const updateToolComponent = async (id, name) => {
    try {
      const data = await fetchWithAuth(`${API_ENDPOINTS.TOOL_COMPONENTS}${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ name }),
      });
      setPortfolioData(prev => ({
        ...prev,
        toolComponents: prev.toolComponents.map(item => 
          item.id === id ? data : item
        ),
      }));
      return data;
    } catch (err) {
      setError('Failed to update tool component');
      throw err;
    }
  };

  // Delete tool component
  const deleteToolComponent = async (id) => {
    try {
      await fetchWithAuth(`${API_ENDPOINTS.TOOL_COMPONENTS}${id}/`, {
        method: 'DELETE',
      });
      
      setPortfolioData(prev => ({
        ...prev,
        toolComponents: prev.toolComponents.filter(item => item.id !== id),
      }));
      
      return true;
    } catch (err) {
      setError('Failed to delete tool component');
      throw err;
    }
  };

  // Function to save entire portfolio at once
  const savePortfolio = async (portfolioFormData) => {
    try {
      setLoading(true);
      
      // 1. Update basic user details
      const userDetails = await updateUserDetails(portfolioFormData.userDetails);
      
      // 2. Handle education entries
      if (portfolioFormData.education) {
        // Delete existing entries not in the new data
        const existingIds = portfolioFormData.education
          .filter(item => item.id && typeof item.id === 'number')
          .map(item => item.id);
          
        for (const education of portfolioData.education) {
          if (!existingIds.includes(education.id)) {
            await deleteEducation(education.id);
          }
        }
        
        // Update or create education entries
        for (const education of portfolioFormData.education) {
          if (education.id && typeof education.id === 'number') {
            await updateEducation(education.id, education);
          } else {
            await addEducation(education);
          }
        }
      }
      
      // 3. Handle certificate entries
      if (portfolioFormData.certificates) {
        // Delete existing entries not in the new data
        const existingIds = portfolioFormData.certificates
          .filter(item => item.id && typeof item.id === 'number')
          .map(item => item.id);
          
        for (const certificate of portfolioData.certificates) {
          if (!existingIds.includes(certificate.id)) {
            await deleteCertificate(certificate.id);
          }
        }
        
        // Update or create certificate entries
        for (const certificate of portfolioFormData.certificates) {
          if (certificate.id && typeof certificate.id === 'number') {
            await updateCertificate(certificate.id, certificate);
          } else {
            await addCertificate(certificate);
          }
        }
      }
      
      // 4. Handle project entries
      if (portfolioFormData.projects) {
        // Delete existing entries not in the new data
        const existingIds = portfolioFormData.projects
          .filter(item => item.id && typeof item.id === 'number')
          .map(item => item.id);
          
        for (const project of portfolioData.projects) {
          if (!existingIds.includes(project.id)) {
            await deleteProject(project.id);
          }
        }
        
        // Update or create project entries
        for (const project of portfolioFormData.projects) {
          if (project.id && typeof project.id === 'number') {
            await updateProject(project.id, project);
          } else {
            await addProject(project);
          }
        }
      }
      
      // 5. Handle tool entries
      if (portfolioFormData.toolNames) {
        // Delete existing entries not in the new data
        const existingIds = portfolioFormData.toolNames
          .filter(item => item.id && typeof item.id === 'number')
          .map(item => item.id);
          
        for (const toolName of portfolioData.toolNames) {
          if (!existingIds.includes(toolName.id)) {
            await deleteToolName(toolName.id);
          }
        }
        
        // Update or create tool category entries
        for (const toolCategory of portfolioFormData.toolNames) {
          let toolNameId;
          
          if (toolCategory.id && typeof toolCategory.id === 'number') {
            const updatedToolName = await updateToolName(toolCategory.id, toolCategory.name);
            toolNameId = updatedToolName.id;
          } else {
            const newToolName = await createToolName(toolCategory.name);
            toolNameId = newToolName.id;
          }
          
          // Handle tools in this category
          if (toolCategory.tools && toolCategory.tools.length > 0) {
            for (const tool of toolCategory.tools) {
              await createTool(tool.name, toolNameId);
            }
          }
        }
      }
      
      // 6. Refresh all data after updates
      await fetchAllData();
      
      return portfolioData;
    } catch (error) {
      setError('Failed to save portfolio: ' + error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  const fetchAllData = async () => {
    setLoading(true);
    try {
      console.log('Fetching portfolio data for email:', email);
      
      // Fetch user details first as it contains nested data
      const userDetailsData = await fetchWithAuth(API_ENDPOINTS.USER_DETAILS(email));
      console.log('Fetched user details:', userDetailsData);
      
      // Update state with all the nested data
      setPortfolioData(prev => ({
        ...prev,
        userDetails: userDetailsData,
        toolNames: userDetailsData.toolname || [],
        education: userDetailsData.education || [],
        certificates: userDetailsData.certificate || [],
        projects: userDetailsData.project || [],
      }));

      // Get additional data from links
      if (userDetailsData.project && userDetailsData.project.length > 0) {
        let allLinks = [];
        for (const project of userDetailsData.project) {
          if (project.link) {
            allLinks = [...allLinks, ...project.link];
          }
        }
        setPortfolioData(prev => ({ ...prev, links: allLinks }));
      }

      // Get tools data
      if (userDetailsData.toolname && userDetailsData.toolname.length > 0) {
        const allTools = userDetailsData.toolname.flatMap(toolname => 
          toolname.tools || []
        );
        setPortfolioData(prev => ({ ...prev, tools: allTools }));
      }

    } catch (err) {
      console.error('Failed to fetch portfolio data:', err);
      setError('Failed to fetch portfolio data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email) {
      fetchAllData();
    }
  }, [email]);

  return {
    portfolioData,
    loading,
    error,
    updateUserDetails,
    addEducation,
    updateEducation,
    deleteEducation,
    addCertificate,
    updateCertificate,
    deleteCertificate,
    addProject,
    updateProject,
    deleteProject,
    addProjectLink,
    updateProjectLink,
    deleteProjectLink,
    createToolName,
    updateToolName,
    deleteToolName,
    createTool,
    updateTool,
    deleteTool,
    createToolComponent,
    updateToolComponent,
    deleteToolComponent,
    savePortfolio,
    fetchAllData
  };
}; 
